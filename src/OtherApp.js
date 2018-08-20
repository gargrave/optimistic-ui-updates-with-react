import React from 'react';

const itemSorter = (a, b) => a.id - b.id;

// fake request; fails for id #3
async function deleteItemRequest(id) {
  return new Promise((resolve, reject) => {
    setTimeout(id === 3 ? reject : resolve, 750);
  });
}

export default class OtherApp extends React.Component {
  state = {
    error: null,
    items: Array.from(Array(5), (_, i) => ({
      id: i + 1,
      title: `Item ${i + 1}`,
    })),
    loading: false,
  };

  deleteItem = (id) => {
    this.setState({ error: null, loading: true }, async() => {
      try {
        await deleteItemRequest(id);
        this.setState(({ items }) => ({
          items: items.filter(i => i.id !== id),
          loading: false,
        }));
      } catch (err) {
        this.setState({
          error: `There was an error deleting item ${id}!`,
          loading: false,
        });
      }
    });
  };

  deleteItemOptimistic = (id) => {
    let prevItem;
    this.setState(({ items }) => {
      prevItem = items.find(i => i.id === id);
      return {
        error: null,
        items: items.filter(i => i.id !== id),
      };
    }, async() => {
      try {
        await deleteItemRequest(id); // eslint-disable-line
      } catch (err) {
        this.setState(({ items }) => ({
          error: `There was an error deleting item ${id}!`,
          items: items.concat(prevItem).sort(itemSorter),
        }));
      }
    });
  };

  render() {
    const { error, items, loading } = this.state;
    return (
      <div className="container">
        <h3 className="text-muted text-center lead pt-2">
          Optimistic UI Updates with React
        </h3>
        <ul style={{ opacity: (loading ? .5 : 1) }}>
          {items.map(item => (
            <li key={item.id}>
              {item.title}{' '}
              <button onClick={() => this.deleteItemOptimistic(item.id)}>
                Delete item
              </button>
            </li>
          ))}
        </ul>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }
}

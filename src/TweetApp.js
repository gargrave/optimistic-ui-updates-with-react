import React from 'react';
import { Tweet } from './Tweet';

const shouldFail = id => [3, 4].includes(id);

// Fake request. Fail for id 3 or 4
function likeTweetRequest(tweetId, like) {
  console.log(`HTTP /like_tweet/${tweetId}?like=${like} (begin)`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldSucceed = !shouldFail(tweetId);
      console.log(
        `HTTP /like_tweet/${tweetId}?like=${like} (${shouldSucceed
          ? 'success'
          : 'failure'})`,
      );
      shouldSucceed ? resolve() : reject();
    }, 1000);
  });
}

const initialState = {
  tweets: [0, 3, 98, 0, 0].map((likes, i) => ({
    id: i + 1,
    likes,
    username: `${shouldFail(i + 1) ? 'Fail' : 'Cool'}Cat${i + 1}`,
    content: `Some really great content here (${i + 1})...`,
  })),
  likedTweets: [2],
};

function setTweetLiked(tweetId) {
  return prevState => {
    const liked = !prevState.likedTweets.includes(tweetId);
    return {
      likedTweets: liked
        ? prevState.likedTweets.concat(tweetId)
        : prevState.likedTweets.filter(id => id !== tweetId),
      tweets: prevState.tweets.map(
        tweet => tweet.id === tweetId
          ? { ...tweet, likes: tweet.likes + (liked ? 1 : -1) }
          : tweet,
      ),
    };
  };
}

export default class TweetApp extends React.Component {
  state = initialState;

  likeRequestPending = false;

  onClickLike = async(tweetId) => {
    if (this.likeRequestPending) {
      console.log('early out -> like request pending!');
      return;
    }

    try {
      // optimistically update state before sending/awaiting the response
      this.likeRequestPending = true;
      this.setState(setTweetLiked(tweetId));
      await likeTweetRequest(tweetId, true);
      console.log('resolved');
    } catch (err) {
      // revert the optimistically-updated state if an error returns
      this.setState(setTweetLiked(tweetId));
      console.error('error');
    } finally {
      this.likeRequestPending = false;
    }
  };

  render() {
    const { tweets, likedTweets } = this.state;
    return (
      <div className="container">
        <h3 className="text-muted text-center lead pt-2">
          Optimistic UI Updates with React
        </h3>
        <div className="list-group">
          {tweets.map(tweet => (
            <Tweet
              isLiked={likedTweets.includes(tweet.id)}
              key={tweet.id}
              onClickLike={this.onClickLike}
              tweet={tweet}
            />
          ))}
        </div>
      </div>
    );
  }
}

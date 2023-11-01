import React, { Component } from 'react';

export class LikeButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: false, // Initially not liked
      count: 0,
    };
  }

  componentDidMount() {
    // Check local storage to see if the user has liked this post before
    const liked = localStorage.getItem(window.location.pathname.split("/")[window.location.pathname.split("/").length-1]) === 'true';
    this.setState({ liked });
    this.updateCount("none")
  }

  handleButtonClick = () => {
    if (this.state.liked) {
      // If already liked, unlike
      this.updateCount("decrement");
      localStorage.setItem(window.location.pathname.split("/")[window.location.pathname.split("/").length-1], 'false');
    } else {
      // If not liked, like
      this.updateCount("increment");
      localStorage.setItem(window.location.pathname.split("/")[window.location.pathname.split("/").length-1], 'true');
    }
    this.setState({ liked: !this.state.liked });
  };

  updateCount(change) {
    // Make an XHR request to the CountAPI to increment or decrement the count
    const url = `https://script.google.com/macros/s/AKfycbysSMMR75dSSryX9nW2VFvXYnd09JEC6vuEt-uTQXVcqWGOy0AwmSECEawVOpLQdTqkfw/exec?POST_NAME=${window.location.pathname.split("/")[window.location.pathname.split("/").length-1]}&ACTION=${change}`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        this.setState({ count:  change == "increment" ? this.state.count + 1 : change == "decrement" ? this.state.count - 1 : parseInt(response) });
      }
    };
  }
  
  render() {
    const buttonStyle = {
      width: '40px',
      height: '40px',
      backgroundColor: this.state.liked ? 'blue' : 'white',
    };

    return (
      <div>
        <button onClick={this.handleButtonClick} style={buttonStyle}></button>
        <span>{this.state.count}</span>
      </div>
    );
  }
}

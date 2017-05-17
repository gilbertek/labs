import React, { Component } from 'React';
import { connect } from 'react-redux';
import {
  showAddDeck,
  hideAddDeck
} from '../../reducer/sidebar';

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const props = this.props;

    return (
      <div className='sidebar'>
        <h2>All Decks</h2>

        {props.decks.map((deck, i) =>
          <li key={i}>{deck.name}</li>
        )}

        { props.addingDeck && <input ref='add' /> }
      </div>
    );
  }
}

export default connect()(Sidebar);

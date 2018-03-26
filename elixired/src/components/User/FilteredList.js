import React, { Component } from 'react';
import PropTypes from 'prop-types';


class FilteredList extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = { value: this.props.defaultState };
  }

  updateState = value => {
    this.setState({ value });
  };

  render() {
    const otherSide = this.state.value === 'dark' ? 'light' : 'dark';
    const transformedProps = this.props.list.filter(
      char => char.side === this.state.value
    );

    return (
      <div>
        <button onClick={() => this.updateState(otherSide)}>Switch</button>

        {transformedProps.map(char => (
          <div key={char.name}>
            <div>Character: {char.name}</div>
            <div>Side: {char.side}</div>
          </div>
        ))}
      </div>
    );
  }
}

export default FilteredList;

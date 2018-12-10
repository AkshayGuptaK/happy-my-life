import React from 'react'

class Card extends React.Component {
  render () { // effort, counter
    return (
      <div className={this.props.texture}>
        <p>{this.props.name}</p>
        <p>{this.props.type}</p>
        <p>{this.props.text}</p>
        <p>{this.props.energy}</p>
        <p>{this.props.happiness}</p>
        <img src={this.props.art} />
      </div>
    )
  }
}

export default Card

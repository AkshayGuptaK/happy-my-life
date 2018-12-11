import React from 'react'

class Card extends React.Component {
  render () { // effort, counter
    console.log(this.props) // debug
    return (
      <div className='card' texture={this.props.texture} onClick={this.props.onClick}>
        <p>{this.props.name}</p>
        <p>{this.props.type}</p>
        <p>{this.props.text}</p>
        <img src={this.props.art} />
        {this.props.energy > 0
          ? <div>
            <p>{this.props.energy}</p>
            <img src='../assets/ltng_bolt.svg' />
          </div>
          : null
        }
        <div>
          <p>{this.props.happiness}</p>
          <img src='../assets/pink_star.svg' />
        </div>
      </div>
    )
  }
}

export default Card

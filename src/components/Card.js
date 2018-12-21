import React from 'react'

class Card extends React.Component {
  render () { // effort, counter, id
    return (
      <div className='card' texture={this.props.texture} onClick={this.props.onClick}>
        <p className='name'>{this.props.name}</p>
        <div className='art'>
          <img src={this.props.art} />
        </div>
        <p className='type'>{this.props.type}</p>
        <div className='icons'>
          {this.props.energy > 0 && <p className='energy'>{this.props.energy}</p>}
          {this.props.effort > 0 && <p className='effort'>{this.props.effort}</p>}
          <p className='happy'>{this.props.happiness}</p>
        </div>
        <div className='textbox'>
          <p className='text'>{this.props.text}</p>
        </div>
      </div>
    )
  }
}

export default Card

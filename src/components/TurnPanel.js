import React from 'react'

class TurnPanel extends React.Component {
  render () {
    return (
      <div className='turnPanel'>
        <p className='turn'>Turn {this.props.turn}</p>
        <p className={this.props.step === 0 ? 'selected' : 'not'}>Begin</p>
        <p className={this.props.step === 1 ? 'selected' : 'not'}>Draw</p>
        <p className={this.props.step === 2 ? 'selected' : 'not'}>Draft</p>
        <p className={this.props.step === 3 ? 'selected' : 'not'}>Play</p>
        <p className={this.props.step === 4 ? 'selected' : 'not'}>End</p>
      </div>
    )
  }
}

export default TurnPanel

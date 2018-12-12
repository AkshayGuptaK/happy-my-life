import React from 'react'

class Counter extends React.Component {
  render () {
    return (
      <div className='counter'>
        <p>{this.props.draft} Drafts</p>
        <p>{this.props.energy} Energy</p>
        <p>{this.props.effort} Effort</p>
        <p>{this.props.happiness} Happiness</p>
      </div>
    )
  }
}

export default Counter

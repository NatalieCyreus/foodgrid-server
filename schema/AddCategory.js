import React, { Component } from 'react';

class AddCategoryForm extends Component {
  state = { category: [] }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState(prevState => ({
      category: [...prevState.category, this.inputNode.value]
    }), () => {
      this.inputNode.value = '';
      this.props.getCategory(this.state.category);
    })
  };

  render() {
    let placeholder;
    if(this.state.category.length >= 1) {
      placeholder = 'add more categories'
    } else {
      placeholder = 'add category';
    }
    return (
      <form onSubmit={this.handleSubmit}>
        <label></label>
        <input placeholder={placeholder} type="text" ref={node => this.inputNode = node}/>
        <button>+</button>
      </form>
    );
  }
}

export default AddCategoryForm;

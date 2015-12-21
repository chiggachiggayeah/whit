var React = require('react');
var ReactDom = require('react-dom');
var utils = require('../utils');
var sockHndlr = require('../socketHandler.js');
//SOCKET EVENTS===========================
//========================================

var UploadForm = React.createClass({
  getInitialState: function(){
    return {file: ''};
  },
  handleFile: function(e){
    this.setState({file: e.target.files[0]})
  },
  handleSubmit: function(e){
    e.preventDefault();
    utils.seedFile(this.state.file);
  },
  render: function(){
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="file" onChange={this.handleFile} />
        <input type="submit"/>
      </form>
    )
  }
});

ReactDom.render(
  <UploadForm />,
  document.getElementById('container')
)

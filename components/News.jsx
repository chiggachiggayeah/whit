var React = require('react');
var ReactDom = require('react-dom');
var utils = require('../utils');
var sockHndlr = require('../socketHandler');

// will probably just use marked in here
var NewsComp = React.createClass({
  getInitialState: function(){
    return {data: []}
  },
  __updateState: function(articleData){
    // extract from the new torrent
    console.log("new torrent hash is: %s", articleData.hash);
    var tempArray = this.state.data;
    // utils.addFile(articleData); //<-- don't load full torrent
    this.setState({data : this.state.data.concat([articleData])})//<-- need the preview here
  },
  render: function(){
    var prevNodes = this.state.data.map(function(article){
      return (
        <ArticlePrevComp
          key={article.hash}
          title={article.title}
          author={article.author}
          preview={article.content} />
      )
    });
    return (
      <div className="news-main">{prevNodes}</div>
    )
  }
});

var ArticlePrevComp = React.createClass({
  genHTML: function(){
    var markup = utils.toMarkdown(this.props.preview);
    return {__html: markup}
  },
  render: function(){
    return (
      <div className="article-prev">
        <div className="article-prev-title">{this.props.title}</div>
        <div className="article-prev-author">{this.props.author}</div>
        <div className="article-prev-body"
              dangerouslySetInnerHTML={this.genHTML()}></div>
      </div>
    )
  }
});

var newsComp = ReactDom.render(
  <NewsComp />,
  document.getElementById('news')
);

sockHndlr.responder.onUpdatePaper(newsComp.__updateState)

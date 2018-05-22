/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */

/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */

// main window component with menu and grid

import React, {Component} from 'react';
import {deepOrange500,  cyan500,
    pinkA200,
    grey100, grey300, grey400, grey500,
    white, darkBlack, fullBlack} from 'material-ui/styles/colors';
import Table from 'material-ui/Table/Table';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableRow from 'material-ui/Table/TableRow';
import TableHeader from 'material-ui/Table/TableHeader';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import TableBody from 'material-ui/Table/TableBody';

import Menu from 'material-ui/Menu/Menu';
import MenuItem from 'material-ui/MenuItem';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';

import TextField from 'material-ui/TextField/TextField';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import DialogForm from './DialogForm'; // Our DialogForm component

const styles = {
  container: {
    textAlign: 'center'
  }
};

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: deepOrange500,
    primary2Color: deepOrange500,
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    //disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    //clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
});


class Main extends Component {
  constructor(props, context) {
    super(props, context);

    var cur_page=this.getHashValue('page');
    cur_page=cur_page?cur_page:1;

    this.state = {
      open: false,
      tableData:[],
      totalItems:0,
      pageSize:5,
      pageNumber:cur_page,
      pagenation:[],
    };
  }

  getHashValue=(key) =>{
    var matches = location.hash.match(new RegExp(key+'=([^&]*)'));
    return matches ? matches[1] : null;
  }


  createPagination=(totalItems)=>{
    var pages = [],
        pages_count=Math.ceil(totalItems/this.state.pageSize);

    if(this.state.pageNumber>pages_count&&pages_count>0){
      this.setPage(pages_count);
    }

    if(pages_count>1)
      for (var i = 0; i < pages_count; i++) {
        pages.push(<li key={i} data-key={i+1} onClick={this.pagerSetPage} className={'pagination-number '+(this.state.pageNumber-1==i?'current-number':'')}>{i+1}</li>);
      }

    return pages;
  }

  // for load data in grid via ajax
  loadData=(data)=>{
    data=!data?JSON.stringify({pageNumber:this.state.pageNumber,pageSize:this.state.pageSize}):data;

    $.ajax({
          url: '/category/list',
          data: data,
          processData: false,
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          type: 'POST',
        })
        .done(function(json) {
          //console.log(form)
          var pagination=this.createPagination(json.totalItems);
          this.setState({tableData: json.items,totalItems:json.totalItems,pagination:pagination});
        }.bind(this));

  }

  // load data on initialization
  componentWillMount=()=> {
    this.loadData();
  }

  // when edit button pressed
  ActionEdit= (object)=>{
      this.refs.dialog.setState({object:object,open: true,action:'edit',parent:this});
  }

  // when create button pressed
  ActionCreate= ()=>{
    this.refs.dialog.setState({object:null,open: true,action:'create',parent:this});
  }

  // when delete button pressed
  ActionDelete= (object)=>{
    if(confirm("Are you shure that you want to delete this category")){
      $.get('/category/delete/'+object._id).done(function () {
        this.loadData();
      }.bind(this));
    }
  }

  // when search button pressed
  handleSearch= (e)=>{
    e.preventDefault();

    var form=$(e.target);

    var formdata = form.serializeArray();
    var data = {};
    $(formdata).each(function(index, obj){
      data[obj.name] = obj.value;
    });
    this.loadData(JSON.stringify({filters:data}));
  }

  // when page button pressed
  pagerSetPage= (e)=>{
    var cur_page=$(e.target).data('key');
    this.setPage(cur_page);
  }

  //setting page
  setPage= (cur_page)=>{
    window.location.hash="page="+cur_page;
    this.setState({pageNumber:cur_page});
    this.loadData(JSON.stringify({pageNumber:cur_page,pageSize:this.state.pageSize}));
  }

  // render whole component
  render() {


    return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <div style={styles.container}>
            <div id="main-container">
              <Menu id="main-menu" >
                <MenuItem primaryText="Create Item" onClick={this.ActionCreate} keyboardFocused={false} />
              </Menu>
              <form onSubmit={this.handleSearch} id="searchForm" action="/search" method="post">
                <TextField ref="filter_title" name="title" keyboardFocused={true} placeholder="type title to search"  label="Category Name"/>
                <FlatButton
                    label="Search"
                    primary={true}
                    keyboardFocused={false}
                    type="submit"
                />

              </form>
            </div>
            <div>
              <Table>
                <TableHeader displaySelectAll={false} djustForCheckbox={false}>
                  <TableRow>
                    <TableHeaderColumn>Image</TableHeaderColumn>
                    <TableHeaderColumn>Category</TableHeaderColumn>
                    <TableHeaderColumn>Title</TableHeaderColumn>
                    <TableHeaderColumn>Description</TableHeaderColumn>
                    <TableHeaderColumn>Actions</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  {this.state.tableData.map( (row, index) => (
                      <TableRow key={index} >
                        <TableRowColumn><img src={"/images/"+row.picture} /></TableRowColumn>
                        <TableRowColumn>{row.category}</TableRowColumn>
                        <TableRowColumn>{row.title}</TableRowColumn>
                        <TableRowColumn>{row.description}</TableRowColumn>
                        <TableRowColumn>
                          <FlatButton
                              label="Edit"
                              primary={true}
                              keyboardFocused={false}
                              onTouchTap={()=>this.ActionEdit(row)}
                          />
                          <FlatButton
                              label="Delete"
                              primary={true}
                              keyboardFocused={false}
                              onTouchTap={()=>this.ActionDelete(row)}
                          />

                        </TableRowColumn>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ul className="md-ui component-pagination">
                {this.state.pagination}
              </ul>
            </div>
            <DialogForm ref="dialog"/>
          </div>
        </MuiThemeProvider>
    );
  }
}

export default Main;
/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */

/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */

//this is from dialog component for edit and insert operation

import React, {Component} from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import TextField from 'material-ui/TextField/TextField';

class DialogForm extends React.Component{

  state = {
    open: false,
    action:null,
    object:null,
    parent:null
  };

  constructor(props){
    super(props);
  }

  handleClose = () => {
    this.setState({open: false});
    if(this.state.parent)
      this.state.parent.loadData();
  };


  handleSubmit=()=>{

    var form=this.refs.form,
        formData = new FormData(form),
        self=this;

    $.ajax({
          url: $(form).attr("action"),
          data: formData,
          processData: false,
          contentType: false,
          type: 'POST',
        })
        .done(function(data) {
          self.handleClose();
        });
  };

  loadFile=(event)=>{
    var reader = new FileReader();
    reader.onload = function(){
      var output = $('#image-preview');
      output.css({'background-image':'url('+reader.result+')'});
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  render() {

    const actions = [
      <FlatButton
          label="Cancel"
          primary={true}
          onTouchTap={this.handleClose}
      />,
      <FlatButton
          label="Submit"
          primary={true}
          keyboardFocused={true}
          onTouchTap={this.handleSubmit}
      />,
    ];

    var title=String(this.state.action),
        preview_style={};
    if(this.state.object)
      preview_style={'background-image':"url(/images/"+this.state.object.picture+')'};

    return (
        <Dialog
            title={title.charAt(0).toUpperCase()+ title.slice(1)+" Item Dialog"}
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
          >

            <form ref="form"  action={"/category/"+this.state.action+(this.state.action=='edit'?'/'+this.state.object._id:'')} method="post" encType="multipart/form-data">
              <div>
                <TextField name="category"  floatingLabelText="Category" floatingLabelFixed={true} defaultValue={this.state.object?this.state.object.category:''}/>
              </div>
              <div>
                <TextField name="title" floatingLabelText="Title" floatingLabelFixed={true} defaultValue={this.state.object?this.state.object.title:''}/>
              </div>

              <div>
                <TextField name="description" floatingLabelText="Description" floatingLabelFixed={true} defaultValue={this.state.object?this.state.object.description:''}/>
              </div>

              <div>
                <label className="custom-file-upload">
                  <input type="file" name="picture"  onChange={this.loadFile}/>
                  Upload File
                </label>
              </div>

              <span style={preview_style} id="image-preview"></span>

            </form>
          </Dialog>
    );
  }
}


export default DialogForm;
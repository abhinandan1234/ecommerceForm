import React from 'react';
import { storage } from '../firebase';
import axios from 'axios';

class ProductForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      brand: '',
      cost: 0,
      size: '',
      stock: 0,
      productImage: 'image.jpeg',
      gender: 'MEN',
      popularity: 0,
      image: '',
      progress: 0,
      images: [],
      url: '',
      cloudUrl: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSingleUpload = this.handleSingleUpload.bind(this);
    this.handlemultipleUpload = this.handlemultipleUpload.bind(this);
    this.singleFileChangedHandler = this.singleFileChangedHandler.bind(this);
    this.multipleFileChangedHandler = this.multipleFileChangedHandler.bind(
      this
    );
    this.resetHandler = this.resetHandler.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  resetHandler() {
    this.setState({
      name: '',
      brand: '',
      cost: 0,
      size: '',
      stock: 0,
      productImage: 'image.jpeg',
      gender: 'MEN',
      popularity: 0,
      image: '',
      progress: 0,
      images: [],
      url: '',
      cloudUrl: [],
    });
  }

  singleFileChangedHandler = event => {
    if (event.target.files[0]) {
      const image = event.target.files[0];
      console.log(image);
      this.setState(() => ({ image }));
    }
  };
  multipleFileChangedHandler = event => {
    if (event.target.files) {
      const images = event.target.files;
      console.log(images);
      this.setState(() => ({ images }));
    }
  };
  handleSingleUpload = () => {
    console.log('clicked');
    const { image } = this.state;
    console.log(image);
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      'state_changed',
      snapshot => {
        // progrss function ....
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress });
      },
      error => {
        // error function ....
        console.log(error);
      },
      () => {
        // complete function ....
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            console.log(url);
            this.setState({ url, progress: 0 });
          });
      }
    );
  };

  handlemultipleUpload = () => {
    console.log('clicked multiple upload');
    const { images } = this.state;
    let imagesArray = [];
    for (var key in images) {
      if (images.hasOwnProperty(key)) {
        console.log(images[key]);
        imagesArray.push(images[key]);
      }
    }
    imagesArray.forEach(image => {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on(
        'state_changed',
        snapshot => {
          // progrss function ....
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState({ progress });
        },
        error => {
          // error function ....
          console.log(error);
        },
        () => {
          // complete function ....
          storage
            .ref('images')
            .child(image.name)
            .getDownloadURL()
            .then(url => {
              console.log(url);
              this.setState(prevState => ({
                cloudUrl: prevState.cloudUrl.concat(url),
                progress: 0,
              }));
            });
        }
      );
    });
  };

  handleSubmit(event) {
    event.preventDefault();

    let size = {};
    size[this.state.size] = this.state.stock;
    const formdata = {
      name: this.state.name,
      brand: this.state.brand,
      cost: this.state.cost,
      size,
      //   stock: this.state.stock,
      gender: this.state.gender,
      popularity: this.state.popularity,
      productImage: this.state.url,
      carouselImage: this.state.cloudUrl,
    };

    console.log('formdata : ', formdata);
    // axios
    //   .post(`http://localhost:4040/api/product/addProduct`, formdata)
    //   .then(response => {
    //     console.log(response.data);
    //     this.setState({
    //       name: '',
    //       brand: '',
    //       cost: 0,
    //       size: '',
    //       stock: 0,
    //       productImage: 'image.jpeg',
    //       gender: 'MEN',
    //       popularity: 0,
    //       image: '',
    //       progress: 0,
    //     });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

  render() {
    return (
      <div>
        <h2> Add Product</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>
              Name
              <input
                type="text"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
                className="form-control"
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Brand
              <input
                type="text"
                name="brand"
                value={this.state.brand}
                onChange={this.handleChange}
                className="form-control"
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Cost
              <input
                type="number"
                name="cost"
                value={this.state.cost}
                onChange={this.handleChange}
                className="form-control"
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Size
              <input
                type="text"
                name="size"
                value={this.state.size}
                onChange={this.handleChange}
                className="form-control"
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Stock
              <input
                type="number"
                name="stock"
                value={this.state.stock}
                onChange={this.handleChange}
                className="form-control"
              />
            </label>
          </div>
          <div className="form-group">
            <input
              type="file"
              name="image"
              onChange={this.singleFileChangedHandler}
              className="form-control"
            />
            <button type="button" onClick={this.handleSingleUpload}>
              upload image
            </button>
          </div>
          <div className="form-group">
            <input
              type="file"
              multiple
              name="images"
              onChange={this.multipleFileChangedHandler}
              className="form-control"
            />
            <button type="button" onClick={this.handlemultipleUpload}>
              upload images
            </button>
          </div>
          <progress value={this.state.progress} max="100" />
          <h3>
            images uploaded ={' '}
            {this.state.cloudUrl.length + (this.state.url ? 1 : 0)}
          </h3>
          <br />
          <input type="submit" className="btn btn-primary" /> OR
          <input
            type="button"
            onClick={this.resetHandler}
            className="btn btn-secondary"
            value="reset"
          />
        </form>
      </div>
    );
  }
}

export default ProductForm;

/*
<div className="form-group">
            <input
              type="file"
              multiple
              name="image"
              onChange={this.multipleFileChangedHandler}
              className="form-control"
            />
          </div>
*/

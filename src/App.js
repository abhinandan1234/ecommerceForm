import React from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import axios from 'axios';

import { storage } from './firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      images: {},
      cloudUrl: [],
      selectedGender: 0,
      name: '',
      brand: '',
      productDesc: '',
      cost: '',
      size: '',
      stock: '',
      color: '',
      pattern: '',
      fabric: '',
      occasions: '',
      productDet: '',
      material: '',
      styleNote: '',
      soldBy: '',
      modelInfo: '',
      category: '0',
      url: '',
      progress: 0,
      dropdownOpen: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSingleUpload = this.handleSingleUpload.bind(this);
    this.handleMultipleUpload = this.handleMultipleUpload.bind(this);
    this.singleFileChangedHandler = this.singleFileChangedHandler.bind(this);
    this.multipleFileChangedHandler = this.multipleFileChangedHandler.bind(
      this
    );
    this.toggle = this.toggle.bind(this);
    this.resetHandler = this.resetHandler.bind(this);
  }
  resetHandler() {
    this.setState({
      image: '',
      images: {},
      cloudUrl: [],
      selectedGender: 0,
      name: '',
      brand: '',
      productDesc: '',
      cost: '',
      size: '',
      stock: '',
      color: '',
      pattern: '',
      fabric: '',
      occasions: '',
      productDet: '',
      material: '',
      styleNote: '',
      soldBy: '',
      modelInfo: '',
      category: '',
      url: '',
      progress: 0,
    });
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
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

  handleMultipleUpload = () => {
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

  handleSubmit = event => {
    event.preventDefault();

    let size = {};
    let gender = ['MEN', 'WOMEN', 'KIDS', 'HOME'];

    size[this.state.size] = this.state.stock;
    const formdata = {
      name: this.state.name,
      productImage: this.state.url,
      carouselImage: this.state.cloudUrl,
      brand: this.state.brand,
      productDescription: this.state.productDesc,
      cost: this.state.cost,
      size,
      gender: gender[this.state.selectedGender - 1],
      category: this.state.category,
      color: this.state.color,
      pattern: this.state.pattern,
      fabric: this.state.fabric,
      occasions: this.state.occasions,
      productDetails: this.state.productDet,
      material: this.state.material,
      styleNote: this.state.styleNote,
      soldBy: this.state.soldBy,
      modelInfo: this.state.modelInfo,
    };
    console.log('formdata : ', formdata);

    axios
      .post(
        'https://ecommercepro.herokuapp.com/api/product/addProduct',
        formdata
      )
      .then(response => {
        console.log(response.data);
        this.resetHandler();
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    let categories = {
      '0': 'SELECT',
      '5d147655fc67df1d4257efc5': 'TOPWEAR',
      '5d16041ee73ab463226cf2af': 'BOTTOMWEAR',
      '5d1604b14665956323f7d529': 'SPORTS',
      '5d1604dde73ab463226cf2b0': 'INDIAN',
      '5': 'PLUS_SIZE',
      '5d1604f74665956323f7d52a': 'FOOTWEAR',
    };
    return (
      <div className="App">
        <div className="Title">Form</div>
        <form className="Form">
          Name
          <input
            className="Input"
            type={Text}
            name="name"
            value={this.state.name}
            onChange={this.handleChange}
          />
          <br />
          Brand
          <input
            className="Input"
            type={Text}
            name="brand"
            value={this.state.brand}
            onChange={this.handleChange}
          />
          <br />
          Category
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret>
              {categories[this.state.category]}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                onClick={() =>
                  this.setState({ category: '5d147655fc67df1d4257efc5' })
                }
              >
                TOPWEAR
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  this.setState({ category: '5d16041ee73ab463226cf2af' })
                }
              >
                BOTTOMWEAR
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  this.setState({ category: '5d1604b14665956323f7d529' })
                }
              >
                SPORTS
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  this.setState({ category: '5d1604dde73ab463226cf2b0' })
                }
              >
                INDIAN
              </DropdownItem>
              <DropdownItem onClick={() => this.setState({ category: '5' })}>
                PLUS SIZE
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  this.setState({ category: '5d1604f74665956323f7d52a' })
                }
              >
                FOOTWEAR
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <br />
          Product Description
          <input
            className="Input"
            type={Text}
            name="productDesc"
            value={this.state.productDesc}
            onChange={this.handleChange}
          />
          <br />
          Cost
          <input
            className="Input"
            type={Text}
            name="cost"
            value={this.state.cost}
            onChange={this.handleChange}
          />
          <br />
          Size
          <input
            className="Input"
            type={Text}
            name="size"
            value={this.state.size}
            onChange={this.handleChange}
          />
          <br />
          Stock
          <input
            className="Input"
            type={Text}
            name="stock"
            value={this.state.stock}
            onChange={this.handleChange}
          />
          <br />
          Gender
          <input
            className="InputRadio"
            type="radio"
            onClick={() => this.setState({ selectedGender: 1 })}
            checked={this.state.selectedGender === 1}
          />
          Men
          <input
            className="InputRadio"
            type="radio"
            onClick={() => this.setState({ selectedGender: 2 })}
            checked={this.state.selectedGender === 2}
          />
          Women
          <input
            className="InputRadio"
            type="radio"
            onClick={() => this.setState({ selectedGender: 3 })}
            checked={this.state.selectedGender === 3}
          />
          Kids
          <input
            className="InputRadio"
            type="radio"
            onClick={() => this.setState({ selectedGender: 4 })}
            checked={this.state.selectedGender === 4}
          />
          Home
          <br />
          Color
          <input
            className="Input"
            type={Text}
            name="color"
            value={this.state.color}
            onChange={this.handleChange}
          />
          <br />
          Pattern
          <input
            className="Input"
            type={Text}
            name="pattern"
            value={this.state.pattern}
            onChange={this.handleChange}
          />
          <br />
          Fabric
          <input
            className="Input"
            type={Text}
            name="fabric"
            value={this.state.fabric}
            onChange={this.handleChange}
          />
          <br />
          Occasions
          <input
            className="Input"
            type={Text}
            name="occasions"
            value={this.state.occasions}
            onChange={this.handleChange}
          />
          <br />
          Product Details
          <input
            className="Input"
            type={Text}
            name="productDet"
            value={this.state.productDet}
            onChange={this.handleChange}
          />
          <br />
          Material
          <input
            className="Input"
            type={Text}
            name="material"
            value={this.state.material}
            onChange={this.handleChange}
          />
          <br />
          Style Note
          <input
            className="Input"
            type={Text}
            name="styleNote"
            value={this.state.styleNote}
            onChange={this.handleChange}
          />
          <br />
          Sold By
          <input
            className="Input"
            type={Text}
            name="soldBy"
            value={this.state.soldBy}
            onChange={this.handleChange}
          />
          <br />
          Model Info
          <input
            className="Input"
            type={Text}
            name="modelInfo"
            value={this.state.modelInfo}
            onChange={this.handleChange}
          />
          <br />
          Product Image
          <input
            className="Input"
            type="file"
            onChange={this.singleFileChangedHandler}
          />
          <button type="button" onClick={this.handleSingleUpload}>
            Upload image
          </button>
          <br />
          Carousel Image
          <input
            className="Input"
            type="file"
            multiple
            onChange={this.multipleFileChangedHandler}
          />
          <button type="button" onClick={this.handleMultipleUpload}>
            Upload images
          </button>
          <br />
          <br />
          <progress value={this.state.progress} max="100" />
          <h3>
            images uploaded ={' '}
            {this.state.cloudUrl.length + (this.state.url ? 1 : 0)}
          </h3>
          <button type="button" className="button" onClick={this.handleSubmit}>
            Submit
          </button>
          <input
            type="button"
            className="button"
            onClick={this.resetHandler}
            value="reset"
          />
        </form>
      </div>
    );
  }
}

export default App;

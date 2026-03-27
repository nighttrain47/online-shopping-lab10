import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
    static contextType = MyContext;
    constructor(props) {
        super(props);
        this.state = {
            txtID: '',
            txtName: '',
            txtDescription: '',
            txtPrice: 0,
            txtImages: '',
            selectedCategories: [],
            chkShow: true
        };
    }
    render() {
        const categoryOptions = this.props.categories?.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
        ));
        return (
            <div className="float-right">
                <h2 className="text-center">PRODUCT DETAIL</h2>
                <form>
                    <table>
                        <tbody>
                            <tr>
                                <td>ID</td>
                                <td><input disabled type="text" value={this.state.txtID} readOnly={true} /></td>
                            </tr>
                            <tr>
                                <td>Name</td>
                                <td><input type="text" value={this.state.txtName} onChange={(e) => { this.setState({ txtName: e.target.value }) }} /></td>
                            </tr>
                            <tr>
                                <td>Description</td>
                                <td><textarea value={this.state.txtDescription} onChange={(e) => { this.setState({ txtDescription: e.target.value }) }} /></td>
                            </tr>
                            <tr>
                                <td>Price</td>
                                <td><input type="number" value={this.state.txtPrice} onChange={(e) => { this.setState({ txtPrice: Number(e.target.value) }) }} /></td>
                            </tr>
                            <tr>
                                <td>Categories</td>
                                <td>
                                    <select
                                        multiple
                                        value={this.state.selectedCategories}
                                        onChange={(e) => {
                                            const options = e.target.options;
                                            const values = [];
                                            for (let i = 0; i < options.length; i++) {
                                                if (options[i].selected) {
                                                    values.push(options[i].value);
                                                }
                                            }
                                            this.setState({ selectedCategories: values });
                                        }}
                                        style={{ height: '80px' }}
                                    >
                                        {categoryOptions}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Images (URLs)</td>
                                <td><input type="text" value={this.state.txtImages} onChange={(e) => { this.setState({ txtImages: e.target.value }) }} placeholder="url1, url2, ..." /></td>
                            </tr>
                            <tr>
                                <td>Show</td>
                                <td><input type="checkbox" checked={this.state.chkShow} onChange={(e) => { this.setState({ chkShow: e.target.checked }) }} /></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <input type="submit" value="ADD NEW" onClick={(e) => this.btnAddClick(e)} />
                                    <input type="submit" value="UPDATE" onClick={(e) => this.btnUpdateClick(e)} />
                                    <input type="submit" value="DELETE" onClick={(e) => this.btnDeleteClick(e)} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        );
    }
    componentDidUpdate(prevProps) {
        if (this.props.item !== prevProps.item && this.props.item) {
            this.setState({
                txtID: this.props.item._id,
                txtName: this.props.item.name,
                txtDescription: this.props.item.description || '',
                txtPrice: this.props.item.price || 0,
                txtImages: this.props.item.images?.join(', ') || '',
                selectedCategories: this.props.item.categories_id?.map(c => c._id) || [],
                chkShow: this.props.item.show !== false
            });
        }
    }
    // event-handlers
    btnAddClick(e) {
        e.preventDefault();
        const { txtName, txtDescription, txtPrice, txtImages, selectedCategories, chkShow } = this.state;
        if (txtName) {
            const product = {
                name: txtName,
                description: txtDescription,
                price: txtPrice,
                categories_id: selectedCategories,
                images: txtImages ? txtImages.split(',').map(s => s.trim()) : [],
                show: chkShow
            };
            this.apiPostProduct(product);
        } else {
            alert('Please input name');
        }
    }
    btnUpdateClick(e) {
        e.preventDefault();
        const { txtID, txtName, txtDescription, txtPrice, txtImages, selectedCategories, chkShow } = this.state;
        if (txtID && txtName) {
            const product = {
                name: txtName,
                description: txtDescription,
                price: txtPrice,
                categories_id: selectedCategories,
                images: txtImages ? txtImages.split(',').map(s => s.trim()) : [],
                show: chkShow
            };
            this.apiPutProduct(txtID, product);
        } else {
            alert('Please select a product and input name');
        }
    }
    btnDeleteClick(e) {
        e.preventDefault();
        if (window.confirm('ARE YOU SURE?')) {
            const id = this.state.txtID;
            if (id) {
                this.apiDeleteProduct(id);
            } else {
                alert('Please select a product');
            }
        }
    }
    // apis
    apiGetProducts() {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.get('/api/admin/products', config).then((res) => {
            const result = res.data;
            this.props.updateProducts(result);
        }).catch((error) => {
            console.error('Error fetching products:', error);
        });
    }
    apiPostProduct(product) {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.post('/api/admin/products', product, config).then((res) => {
            const result = res.data;
            if (result && !result.error) {
                alert('SUCCESS!');
                this.apiGetProducts();
            } else {
                alert('FAIL! ' + (result.error || ''));
            }
        }).catch((error) => {
            console.error('Error adding product:', error);
            alert('Error adding product');
        });
    }
    apiPutProduct(id, product) {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.put('/api/admin/products/' + id, product, config).then((res) => {
            const result = res.data;
            if (result && !result.error) {
                alert('SUCCESS!');
                this.apiGetProducts();
            } else {
                alert('FAIL! ' + (result.error || ''));
            }
        }).catch((error) => {
            console.error('Error updating product:', error);
            alert('Error updating product');
        });
    }
    apiDeleteProduct(id) {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.delete('/api/admin/products/' + id, config).then((res) => {
            const result = res.data;
            if (result && result.success) {
                alert('SUCCESS!');
                this.apiGetProducts();
            } else {
                alert('FAIL! ' + (result.error || ''));
            }
        }).catch((error) => {
            console.error('Error deleting product:', error);
            alert('Error deleting product');
        });
    }
}
export default ProductDetail;

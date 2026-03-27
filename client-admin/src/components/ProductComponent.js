import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
    static contextType = MyContext;
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            categories: [],
            itemSelected: null,
            keyword: '',
            noPages: 0,
            curPage: 1
        };
    }
    render() {
        const products = this.state.products || [];
        const prods = products.map((item) => {
            return (
                <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
                    <td>{item._id}</td>
                    <td>{item.name}</td>
                    <td>{item.price?.toLocaleString()} VNĐ</td>
                    <td>{item.categories_id?.map(c => c.name).join(', ')}</td>
                    <td>{item.show ? 'Yes' : 'No'}</td>
                </tr>
            );
        });
        return (
            <div>
                <div className="float-left">
                    <h2 className="text-center">PRODUCT LIST</h2>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={this.state.keyword}
                            onChange={(e) => this.setState({ keyword: e.target.value })}
                        />
                        <input type="button" value="SEARCH" onClick={() => this.btnSearchClick()} />
                        <input type="button" value="RESET" onClick={() => this.btnResetClick()} />
                    </div>
                    <table className="datatable" border="1">
                        <tbody>
                            <tr className="datatable">
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Categories</th>
                                <th>Show</th>
                            </tr>
                            {prods}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        <input
                            type="button"
                            value="« Prev"
                            disabled={this.state.curPage <= 1}
                            onClick={() => this.apiGetProducts(this.state.curPage - 1)}
                        />
                        <span style={{ margin: '0 10px' }}>
                            Trang {this.state.curPage} / {this.state.noPages}
                        </span>
                        <input
                            type="button"
                            value="Next »"
                            disabled={this.state.curPage >= this.state.noPages}
                            onClick={() => this.apiGetProducts(this.state.curPage + 1)}
                        />
                    </div>
                </div>
                <div className="inline" />
                <ProductDetail
                    item={this.state.itemSelected}
                    categories={this.state.categories}
                    updateProducts={this.updateProducts}
                />
                <div className="float-clear" />
            </div>
        );
    }
    componentDidMount() {
        this.apiGetProducts();
        this.apiGetCategories();
    }
    // event-handlers
    trItemClick(item) {
        this.setState({ itemSelected: item });
    }
    btnSearchClick() {
        if (this.state.keyword) {
            this.apiSearchProducts(this.state.keyword);
        }
    }
    btnResetClick() {
        this.setState({ keyword: '' });
        this.apiGetProducts();
    }
    // apis
    apiGetProducts(page = 1) {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.get('/api/admin/products?page=' + page, config).then((res) => {
            const result = res.data;
            this.setState({
                products: result.products || [],
                noPages: result.noPages || 0,
                curPage: result.curPage || 1
            });
        }).catch((err) => {
            console.error('Error fetching products:', err);
            this.setState({ products: [] });
        });
    }
    apiGetCategories() {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.get('/api/admin/categories', config).then((res) => {
            const result = res.data;
            this.setState({ categories: result });
        }).catch((error) => {
            console.error('Error fetching categories:', error);
        });
    }
    apiSearchProducts(keyword) {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.get('/api/admin/products/search?keyword=' + encodeURIComponent(keyword), config).then((res) => {
            const result = res.data;
            this.setState({ products: result });
        }).catch((error) => {
            console.error('Error searching products:', error);
        });
    }
    updateProducts = (products) => {
        this.setState({ products: products });
    }
}
export default Product;

/**
 * Created by InspireUI on 4/07/2018.
 *  luyxtran264@gmail.com
 * @format
 */

import WooCommerceAPI from "./WooCommerceAPI";

export default class WooWorker {
  _api = null;

  static init = ({
    url,
    consumerKey,
    consumerSecret,
    wpAPI = true,
    version = "wc/v2",
    queryStringAuth = true,
    language
  }) => {
    try {
      this._api = new WooCommerceAPI({
        url,
        consumerKey,
        consumerSecret,
        wpAPI,
        version,
        queryStringAuth,
        language
      });
    } catch (error) {
      console.log(error);
    }
  };
  static getCategories = async () => {
    try {
      const response = await this._api.get("products/categories", {
        hide_empty: true,
        per_page: 100,
        order: "desc",
        orderby: "count"
      });
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };
  static getCustomerByEmail = async email => {
    try {
      const response = await this._api.get("customers", { email });
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };
  static getCustomerById = async id => {
    try {
      const response = await this._api.get(`customers/${id}`);
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };
  static getCustomers = async (id) => {
    try {
      const response = await this._api.get(`customers`);
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };
  static productsByCategoryId = async (category, per_page, page, filter) => {
    try {
      const response = await this._api.get("products", {
        category,
        per_page,
        page,
        purchasable: true,
        status: "publish",
        ...filter
      });
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };
  static productsByCategoryTag = async (
    category,
    tag,
    featured,
    onSale,
    products,
    per_page,
    page
  ) => {
    try {
      // only show product published
      let params = {
        per_page,
        page,
        purchasable: true,
        status: "publish",
        orderby: "date",
        order: "asc"
      };
      if (category != "") {
        params = { ...params, category };
      } else if (tag != "") {
        params = { ...params, tag };
      } else if (featured) {
        params = { ...params, featured };
      } else if (onSale) {
        params = { ...params, on_sale: onSale };
      } else if (products && products.length > 0) {
        params = { ...params, include: products };
      }
      const response = await this._api.get("products", params);
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };
  static reviewsByProductId = async id => {
    try {
      const response = await this._api.get(`products/${id}/reviews`);
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };
  static createOrder = async data => {
    try {
      const response = await this._api.post("orders", data);
      const json = response.json();

      if (json.id != 'undefined') {
        this._api.post(`orders/${json.id}`, {status: 'processing'});
      }

      return json;
    } catch (err) {
      console.log(err);
    }
  };
  static updateOrder = async (data, id) => {
    try {
      const response = await this._api.post(`orders/${id}`, data);
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };
  static productsByTagId = async (tag, per_page, page) => {
    try {
      const response = await this._api.get("products", {
        tag,
        status: "publish",
        per_page,
        page
      });
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };
  static productsByName = async (name, per_page, page, filter = {}) => {
    try {
      const response = await this._api.get("products", {
        search: name,
        status: "publish",
        per_page,
        page,
        ...filter
      });
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };
  static productSticky = async (per_page, page, tagIdBanner = 273) => {
    try {
      const response = await this._api.get("products", {
        tag: tagIdBanner,
        status: "publish",
        per_page,
        page
      });
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };
  static getAllProducts = async (
    per_page,
    page,
    order = "desc",
    orderby = "date",
    on_sale = null
  ) => {
    try {
      const data = {
        per_page,
        page,
        order,
        orderby
      };
      if (on_sale) {
        data.on_sale = true;
      }
      const response = await this._api.get("products", data);
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };
  static ordersByCustomerId = async (id, per_page, page) => {
    try {
      const data = {
        customer: id,
        per_page,
        page
      };
      const response = await this._api.get("orders", data);
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };
  static createNewOrder = async (data, callback, failCallBack) => {
    try {
      const response = await this._api.post("orders", data);
      const json = await response.json();

      if (json.id != 'undefined') {
        this._api.post(`orders/${json.id}`, {status: 'processing'});
      }

      if (json.code === undefined) {
        callback(json);
      } else {
        typeof failCallBack === "function" && failCallBack();
      }
    } catch (error) {
      console.log(error);
    }
  };
  static getPayments = async () => {
    try {
      const response = await this._api.get("payment_gateways");
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };
  static setOrderStatus = async (orderId, status, callback) => {
    try {
      const response = await this._api.post(`orders/${orderId}`, { status });
      const json = await response.json();
      if (json.code === undefined) {
        callback(JSON.stringify(json.code));
      } else {
        console.log(json);
      }
    } catch (error) {
      console.log(error);
    }
  };
  static productVariant = async (product, per_page, page) => {
    try {
      const data = {
        per_page,
        page
      };
      const response = await this._api.get(
        `products/${product.id}/variations`,
        data
      );
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };
  static getProductRelated = async product => {
    try {
      const data = {
        include: [product]
      };
      const response = await this._api.get("products", data);
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };
  static getAllCouponCode = async () => {
    try {
      const response = await this._api.get("coupons");
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };
  static getShippingMethod = async zoneId => {
    zoneId = zoneId || 1;
    try {
      const response = await this._api.get(
        "shipping/zones/" + zoneId + "/methods"
      );
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };
  static getProductId = async productId => {
    try {
      const response = await this._api.get("products/" + productId);
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  };

  static setBookingID = (orderId, bookID, callback) => {
    try {
      this._api
        .post("orders/" + orderId, { "Booking ID": bookID })
        .then(json => {
          if (json.code === undefined) callback(json);
          else {
            alert(JSON.stringify(json.code));
            // console.log(JSON.stringify(json))
          }
        })
        .catch(error => console.log(error));
    } catch (err) {
      console.log(err);
    }
  };

  static getTags = async () => {
    try {
      const response = await this._api.get("products/tags", {
        hide_empty: true,
        per_page: 100,
        order: "desc",
        orderby: "count"
      });
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };

  static getBrands = async () => {
    try {
      const response = await this._api.get("brands", {
        hide_empty: true,
        per_page: 100,
        order: "desc",
        orderby: "count"
      });
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };

  static removeProductById = async productId => {
    try {
      const response = await this._api.delete(`products/${productId}`);
      return response.json();
    } catch (err) {
      console.error(["err remove product", err]);
    }
  };

  static getOrderNotes = async orderId => {
    try {
      const response = await this._api.get(`orders/${orderId}/notes`);
      return response.json();
    } catch (err) {
      console.error(["err remove product", err]);
    }
  };
}

"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { FormEvent } from "react";
import { Amplify } from "aws-amplify";
import "./Inventory.css";
import "@aws-amplify/ui-react/styles.css";
import {
  generateClient as apiClientGenerator,
  GraphQLResult,
  GraphQLSubscription,
} from "aws-amplify/api";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Button, View, withAuthenticator } from "@aws-amplify/ui-react";
import { listStocks, getStock } from "../../../src/graphql/queries";
import {
  createStock as createStockMutation,
  deleteStock as deleteStockMutation,
  updateStock as updateStockMutation,
} from "../../../src/graphql/mutations";

import type { WithAuthenticatorProps } from "@aws-amplify/ui-react";
import config from "../../../src/amplifyconfiguration.json";
Amplify.configure(config);

const initialData = {
  id: "",
  item_name: "",
  item_description: "",
  category: "",
  unit_cost: "",
};

interface Stock {
  id: string;
  item_name: string;
  item_description: string;
  category: string;
  unit_cost: string;
}

//defining custome type input
// interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
//   variation?: string;
// }

const apiClient = apiClientGenerator();

//Types
type inventoryState = boolean;

const App = ({ signOut }: WithAuthenticatorProps) => {
  const [Stock, setStock] = useState<Stock[]>([]);

  const totalStock = Stock.length;

  const [Alert, setAlert] = useState("");

  const [unit, setUnit] = useState("");

  async function status() {
    if (Stock.length < 6) {
      setAlert("Low stock");
    } else {
      setAlert("Good");
    }
  }

  useEffect(() => {
    status();
  }, [Stock]);

  async function units() {
    if (Stock.length < 2) {
      setUnit("unit");
    } else {
      setUnit("units");
    }
  }

  useEffect(() => {
    units();
  }, [Stock]);

  //state for managing inventory data
  const [InventoryData, setInventoryData] = useState(initialData);
  const { item_name, item_description, category, unit_cost } = InventoryData;

  const [values, setValues] = useState(initialData);

  console.log("inventory:", InventoryData);

  //state for controlling add inventory visibility
  const [addInventory, setAddInvetory] = useState<inventoryState>(false);

  useEffect(() => {
    fetchStock();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInventoryData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInventoryData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //function for setting setAddinventory to true
  const ExpandInventoryField = () => {
    setAddInvetory(!addInventory);
  };

  //fetch stockdata on the specific id of the stock
  async function fetchStockOnId({ id }: { id: string }) {
    setAddInvetory(!addInventory);
    try {
      const apiData: GraphQLResult<any> | GraphQLSubscription<any> =
        await apiClient.graphql({
          query: getStock,
          variables: { id },
        });
      const stockItem = apiData.data.getStock;
      setInventoryData(stockItem);
      setValues(stockItem);
      return stockItem;
    } catch (error) {
      console.error("Error fetching stock item:", error);
      throw error;
    }
  }

  async function fetchStock() {
    const apiData: GraphQLResult<any> | GraphQLSubscription<any> =
      await apiClient.graphql({ query: listStocks });
    const StockFromAPI = apiData.data.listStocks.items;
    setStock(StockFromAPI);
  }

  const expenseEditId = values.id;

  async function createStock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = {
      item_name,
      item_description,
      category,
      unit_cost,
    };

    if (!expenseEditId) {
      await apiClient.graphql({
        query: createStockMutation,
        variables: { input: data },
      });
    } else {
      await apiClient.graphql({
        query: updateStockMutation,
        variables: { input: { id: expenseEditId, ...data } },
      });
    }

    fetchStock(); // Fetch updated stock list
    setInventoryData(initialData); // Reset form fields
    // event.currentTarget.reset();
  }

  async function deleteStock({ id }: { id: string }) {
    const newStock = Stock.filter((stock) => stock.id !== id);
    setStock(newStock);
    await apiClient.graphql({
      query: deleteStockMutation,
      variables: { input: { id } },
    });
  }

  console.log("stock:", Stock);

  return (
    <View className="flex flex-col">
      <View className="flex w-full h-20 bg-gray-300 shadow-lg">
        <View className="flex items-center absolute h-14 w-1/2">
          <h2 className="ml-8 text-4xl text-black">Invetory</h2>
          <label className="absolute ml-8 mt-12">DashBoard</label>
        </View>
        <View className="absolute right-7 mt-5">
          <Button onClick={signOut}>Sign Out</Button>
        </View>
      </View>
      <View>
        <View className="flex items-center absolute left-1/2 h-15 w-1/2 bg-slate-400">
          <input
            type="button"
            value={addInventory ? "Close" : "Add Inventory"}
            name="add_inventory"
            className="absolute bg-orange-400 hover:bg-orange-300 hover:cursor-pointer h-12 w-48 rounded-md text-white top-6 text-lg outline-none border-none right-7 transition duration-300 ease-in-out transform shadow-lg"
            onClick={ExpandInventoryField}
          />
        </View>
      </View>
      <View className="mt-5 ml-6">
        <label>Total stock : </label>
        {totalStock} {unit}
      </View>
      <View className="ml-6">
        <label>Stock status : </label>
        {Alert}
      </View>
      {addInventory && (
        <View
          as="form"
          className="flex w-1/2 border border-gray-300 flex-col h-80 mt-24 py-5 px-6 ml-4"
          onSubmit={createStock}
        >
          <View className="Field">
            <label htmlFor="item_name">Item name :</label>
            <input
              type="text"
              name="item_name"
              className="h-10 mt-5 ml-2 w-44 text-center border-b border-black bg-white"
              placeholder="Item name"
              value={InventoryData.item_name || ""}
              onChange={handleInputChange}
            />
          </View>
          <View className="Field">
            <label htmlFor="item_description">Item description :</label>
            <input
              type="text"
              name="item_description"
              className="h-10 mt-2 w-56 border-b border-black text-center ml-2 bg-white"
              placeholder="Item description"
              value={InventoryData.item_description || ""}
              onChange={handleInputChange}
            />
          </View>
          <View className="Field">
            <label htmlFor="item_description">Category :</label>
            <select
              className="h-10 mt-5 ml-2 w-44 text-center rounded-md outline-none text-lg bg-white border border-black hover:cursor-pointer"
              name="category"
              value={category || ""}
              onChange={handleSelectChange}
            >
              <option value="">Select category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Office supplies">Office supplies</option>
              <option value="Stationary">Stationary</option>
              <option value="Furnitures">Furnitures</option>
              <option value="Appliances">Appliances</option>
              <option value="Tools and Equipments supplies">
                Tools and Equipments
              </option>
              <option value="Home and Garden">Home and Garden</option>
              <option value="Fitness">Fitness</option>
              <option value="Toys and Games">Toys and Games</option>
              <option value="Health and Beauty">Health and Beauty</option>
              <option value="Books and Magazines">Books and Magazines</option>
            </select>
          </View>
          <View className="Field">
            <label htmlFor="unit_cost">Unit cost :</label>
            <input
              type="text"
              name="unit_cost"
              className="h-10 mt-2 ml-2 w-56 text-center border-b border-black bg-white"
              placeholder="Unit cost"
              value={InventoryData.unit_cost || ""}
              onChange={handleInputChange}
            />
          </View>
          <input
            type="submit"
            // variation="primary"
            name="save_button"
            value="Save"
            className="w-44 text-white bg-green-400 outline-none h-14 rounded-lg mt-4 border-none hover:cursor-pointer hover:bg-green-300 transition duration-300 ease-in-out transform shadow-lg"
          />
        </View>
      )}
      <View className="flex max-h-96 mt-20 w-full overflow-y-scroll">
        <table
          className="border-collapse mx-auto text-md h-auto shadow-md "
          style={{ width: "98%" }}
        >
          <thead className="sticky top-0">
            <tr className="bg-orange-400 text-white text-left">
              <th className="text-center py-3 px-6">No</th>
              <th className="text-center py-3 px-6">Item Name</th>
              <th className="text-center py-3 px-6">Item Description</th>
              <th className="text-center py-3 px-6">Category</th>
              <th className="text-center py-3 px-6">Unit Cost</th>
              <th className="text-center py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Stock.map((stock, index) => {
              return (
                <tr
                  key={stock.id}
                  className={`border-b border-gray-100 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } ${
                    index === Stock.length - 1
                      ? "border-b-2 border-orange-500"
                      : ""
                  } text-black overflow-y-auto`}
                >
                  <td className="text-center py-3 px-6">{index + 1}</td>
                  <td className="text-center py-3 px-6">{stock.item_name}</td>
                  <td className="text-center py-3 px-6">
                    {stock.item_description}
                  </td>
                  <td className="text-center py-3 px-6">{stock.category}</td>
                  <td className="text-center py-3 px-6">{stock.unit_cost}</td>
                  <td className="text-center py-3 px-6">
                    <label>
                      <button
                        className="btn btn-edit"
                        // variation="link"
                        onClick={() => fetchStockOnId(stock)}
                      >
                        <FaEdit />
                      </button>
                    </label>
                    <button
                      className="btn btn-delete"
                      // variation="link"
                      onClick={() => deleteStock(stock)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </View>
    </View>
  );
};

export default withAuthenticator(App);
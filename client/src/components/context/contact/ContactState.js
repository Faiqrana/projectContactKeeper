import React, { useReducer } from "react";
import axios from "axios";
import contactContext from "./contactContext";
import ContactReducer from "./ContactReducer";

import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACT,
  CLEAR_FILTER,
  CONTACT_ERROR,
  GET_CONTACT,
  CLEAR_CONTACT
} from "../types";

const ContactState = props => {
  const initialState = {
    contacts: null,
    current: null,
    filtered: null,
    error: null
  };

  const [state, dispatch] = useReducer(ContactReducer, initialState);
  //get Contact
  const getContacts = async () => {
    try {
      const res = await axios.get("/api/contact");
      dispatch({
        type: GET_CONTACT,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: CONTACT_ERROR,
        payload: err.msg
      });
    }
  };

  //Add contact
  const addContact = async contact => {
    const config = {
      headers: {
        "Cotent-Type": "application/json"
      }
    };

    try {
      const res = await axios.post("/api/contact", contact, config);

      dispatch({
        type: ADD_CONTACT,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: CONTACT_ERROR,
        payload: err.msg
      });
    }
  };

  //update contact
  const updateContact = async contact => {
    const config = {
      headers: {
        "Cotent-Type": "application/json"
      }
    };

    try {
      const res = await axios.put(
        `/api/contact/${contact._id}`,
        contact,
        config
      );

      dispatch({
        type: UPDATE_CONTACT,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: CONTACT_ERROR,
        payload: err.msg
      });
    }
  };

  //delete contact
  const deleteContact = async _id => {
    try {
      await axios.delete(`/api/contact/${_id}`);

      dispatch({
        type: DELETE_CONTACT,
        payload: _id
      });
    } catch (err) {
      dispatch({
        type: CONTACT_ERROR,
        payload: err.msg
      });
    }
  };

  //set current
  const setCurrent = contact => {
    dispatch({ type: SET_CURRENT, payload: contact });
  };

  //clear COntacts
  const clearContacts = () => {
    dispatch({ type: CLEAR_CONTACT });
  };

  //clear current
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  //filter contact
  const filterContact = text => {
    dispatch({
      type: FILTER_CONTACT,
      payload: text
    });
  };

  //clear filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  return (
    <contactContext.Provider
      value={{
        contacts: state.contacts,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        addContact,
        deleteContact,
        setCurrent,
        clearCurrent,
        updateContact,
        filterContact,
        clearFilter,
        getContacts,
        clearContacts
      }}
    >
      {props.children}
    </contactContext.Provider>
  );
};

export default ContactState;

import React from 'react';
import '../styles/ItemList.css';


const ItemList = (props) => <a key={props.id} className="list-item" onClick={props.action}>{props.content}</a>
export default ItemList;

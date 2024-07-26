import { useState } from "react";
import "./App.css";
// import imsge from '../public/image/pic2.jpg'

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "./image/pic1.jpg",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "./image/pic2.jpg",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "./image/pic5.jpg",
    balance: 0,
  },
];

const Button = ({ children, onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
};

function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleAddFriend = (friend) => {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(!showAddFriend);
  };

  const handleShowAddFriend = () => {
    setShowAddFriend(!showAddFriend);
    setSelectedFriend(null);
  };

  const handleSelection = (friend) => {
    // setSelectedFriend((cur) => (cur?.id === friend.id ? "null" : "friend"));

    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  };

  const handleSplitBill = (value) => {
    setFriends(() =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  };

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          handleSelection={handleSelection}
        />

        {showAddFriend && <FormAddFriend handleAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          handleSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

const FriendsList = ({ friends, handleSelection, selectedFriend }) => {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          handleSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
};

const Friend = ({ friend, handleSelection, selectedFriend }) => {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 ? (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      ) : null}
      {friend.balance > 0 ? (
        <p className="green">
          {friend.name} owes you ${friend.balance}
        </p>
      ) : null}
      {friend.balance === 0 ? <p>You and {friend.name} are even</p> : null}

      <Button onClick={() => handleSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
};

const FormAddFriend = ({ handleAddFriend }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("./image/pic4.jpg");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !image) return;

    const newFriend = {
      image,
      name,
      balance: 0,
    };

    handleAddFriend(newFriend);

    setName("");
    setImage("./image/pic4.jpg");
  };

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👬 Friend Name</label>
      <input
        type="number"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼 Image url</label>
      <input
        type="number"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
};

const FormSplitBill = ({ selectedFriend, handleSplitBill }) => {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bill || !paidByUser) return;

    handleSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  };

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💲 Bill Value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      />

      <label>🕴 Your Expenses</label>
      <input
        type="number"
        value={paidByUser}
        onChange={(e) => setPaidByUser(+e.target.value)}
      />

      <label>👬 {selectedFriend.name}'s Expenses</label>
      <input type="number" disabled value={paidByFriend} />

      <label>💲 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
};

export default App;

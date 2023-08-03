import { useState } from "react";

function Button({ children }) {
  return (
    <button className="button" onClick={onclick}>
      {children}
    </button>
  );
}

export default function App() {
  const initialFriends = [
    {
      id: 118836,
      name: "Clark",
      image: "https://i.pravatar.cc/48?u=118836",
      balance: -7,
    },
    {
      id: 933372,
      name: "Sarah",
      image: "https://i.pravatar.cc/48?u=933372",
      balance: 20,
    },
    {
      id: 499476,
      name: "Anthony",
      image: "https://i.pravatar.cc/48?u=499476",
      balance: 0,
    },
  ];
  const [showAddFriend, setShowAddFriend] = useState(false);
  function handleShowAddFriend() {
    setShowAddFriend((showAddFriend) => !showAddFriend);
    console.log(showAddFriend);
  }
  const [friends, setFriends] = useState(initialFriends);
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
  }
  const [selectedFriends, setSelectedFriends] = useState(null);
  function handleSelect(friend) {
    // setSelectedFriends(friend);
    console.log(friend);
    console.log(selectedFriends);
    setSelectedFriends((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriends.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriends(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <Friends
          friends={friends}
          onSelect={handleSelect}
          selectedFriends={selectedFriends}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <button className="button" onClick={handleShowAddFriend}>
          {showAddFriend ? "close" : "Add Friend"}
        </button>
      </div>
      {selectedFriends && (
        <FormSplitBill
          selectedFriends={selectedFriends}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function Friends({ friends, onSelect, selectedFriends }) {
  return (
    <div className="friends">
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelect={onSelect}
          selectedFriends={selectedFriends}
        />
      ))}
    </div>
  );
}

function Friend({ friend, onSelect, selectedFriends }) {
  const isSelected = friend.id === selectedFriends?.id;
  return (
    <li className={isSelected && "selected"}>
      <div className="sub-friend">
        <img src={friend.image} alt={friend.name} />
        <div className="f-detail">
          <p>{friend.name}</p>
          {friend.balance < 0 && (
            <p className="red">
              You owe {friend.name} {friend.balance}$
            </p>
          )}
          {friend.balance > 0 && (
            <p className="green">
              {friend.name} owe {friend.balance}$
            </p>
          )}
          {friend.balance === 0 && <p>You and {friend.name} are even</p>}
        </div>
      </div>
      <div onClick={() => onSelect(friend)}>
        <Button>{isSelected ? "Close" : "Select"}</Button>
      </div>
    </li>
  );
}
function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=118836");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = { name, image: `${image}?=${id}`, balance: 0, id };

    onAddFriend(newFriend);
    setImage("https://i.pravatar.cc/48?u=933372");
    setName("");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriends, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const paidByFriend = bill ? bill - paidByUser : "";
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriends.name}</h2>
      <br></br>
      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill
              ? paidByFriend
              : Number(e.target.value)
          )
        }
      />

      <label> {selectedFriends.name}'s expenses</label>
      <input type="text" value={paidByFriend} />

      <label>who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend"> {selectedFriends.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}

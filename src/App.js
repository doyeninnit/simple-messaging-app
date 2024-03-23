// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


// import React, { useState } from 'react';
// import getWeb3 from './getWeb3';
// import { contractABI, contractAddress } from './contractConfig';
// import './App.css';
// import { getContract } from './getContract';

// function App() {
//     const [web3, setWeb3] = useState(null);
//     const [contract, setContract] = useState(null);
//     const [account, setAccount] = useState(null);
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');

//     // Initialize web3 connection
//     const initWeb3 = async () => {
//         try {
//             const web3 = await getWeb3();
//             const accounts = await web3.getSigner().getAddress();
//             const contract = new web3.getSigner().provider.getSigner(contractAddress, contractABI);

//             setWeb3(web3);
//             setAccount(accounts[0]);
//             setContract(contract);
//         } catch (error) {
//             alert('Failed to load web3, accounts, or contract. Check console for details.');
//             console.error(error);
//         }
//     };

  

//     // Handle message input change
//     const handleMessageChange = (event) => {
//         setMessage(event.target.value);
//     };

//     const connectWalletHandler = async () => {
//       const { provider, error } = await getWeb3();

//       if (error) {
//           setError(error);
//           return;
//       }

//       // Proceed with using the provider for your dApp
//       // Reset error state if successful
//       setError('');
//   };

//     // Handle form submit to send a message
//     const sendMessageHandler = async (event) => {
//         event.preventDefault();
//         if (!contract) return;

//         try {
//             await contract.createMessage(message);
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     };

//     const connectContract = async () => {
//       const { contract, error } = await getContract();

//       if (error) {
//           setError(error);
//           return;
//       }

//       // Example of calling a contract's read function
//       try {
//           const message = await contract.readMessage(0);
//           const messageStr = message.toString(); // For example, if it's a number you want to display
//           setMessage(messageStr);
//       } catch (readError) {
//           console.error("Error reading message from contract:", readError);
//           setError(readError.message || "Failed to read message");
//       }
//   };

//     return (
//         <div className="App">
//             <header className="App-header">
//                 <button onClick={connectWalletHandler}>Connect Wallet</button>
//                 <form onSubmit={sendMessageHandler}>
//                     <input type="text" value={message} onChange={handleMessageChange} />
//                     <button type="submit">Send Message</button>
//                 </form>
//             </header>
//             <button onClick={connectContract}>Connect to Contract</button>
//             {message && <p>Message: {message}</p>}
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//         </div>
//     );
// }

// export default App;



import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from './contractConfig';
import './App.css';

function App() {
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [messages, setMessages] = useState([]);
    const [readError, setReadError] = useState('');
    
    // Initialize web3 connection and contract
    useEffect(() => {
        const init = async () => {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, contractABI, signer);

                setProvider(provider);
                setContract(contract);
                setAccount(await signer.getAddress());
            } catch (error) {
                console.error('Failed to load web3, accounts, or contract. Check console for details.', error);
                setError(error.message);
            }
        };

        init();
    }, []);

    // Handle message input change
    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };


    // Assuming a method that fetches all messages might exist
const fetchMessages = async () => {
  if (!contract) return;

  try {
      // Example of calling a hypothetical contract method that returns all messages
      // Adjust this to match your contract's actual method for fetching messages
      const messages = await contract.messages();
      setMessages(messages);
  } catch (error) {
      console.error('Error fetching messages:', error);
      setReadError(error.message || "Failed to fetch messages");
  }
};

// Call fetchMessages somewhere in your component, for example, after successful contract connection or via a user action

    // Handle form submit to send a message
    const sendMessageHandler = async (event) => {
        event.preventDefault();
        if (!contract) return;

        try {
            const tx = await contract.createMessage(message);
            await tx.wait();
            console.log('Message sent:', message);
            setMessage(''); // Optionally clear the message input after send
        } catch (error) {
            console.error('Error sending message:', error);
            setError(error.message);
        }
    };

//     return (
//         <div className="App">
//             <header className="App-header">
//                 {/* {!account ? (
//                     <button onClick={() => window.location.reload()}>Connect Wallet</button>
//                 ) : (
//                     <form onSubmit={sendMessageHandler}>
//                         <input type="text" value={message} onChange={handleMessageChange} placeholder="Enter message" />
//                         <button type="submit">Send Message</button>
//                     </form>
//                 )} */}


//                 {error && <p style={{ color: 'red' }}>{error}</p>}
//             </header>
//         </div>
//     );
// }

return (
  <div className="App">
      <header className="App-header">
          {!account ? (
              <button onClick={() => window.location.reload()}>Connect Wallet</button>
          ) : (
              <div>
                  <form onSubmit={sendMessageHandler}>
                      <input type="text" value={message} onChange={handleMessageChange} placeholder="Enter message" />
                      <button type="submit">Send Message</button>
                  </form>
                  <button onClick={fetchMessages}>Fetch Messages</button> {/* Add a button to trigger message fetching */}
              </div>
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {readError && <p style={{ color: 'red' }}>{readError}</p>}
          <div>
              {messages.map((msg, index) => (
                  <p key={index}>{msg}</p> // Display each message. Adjust depending on your message structure
              ))}
          </div>
      </header>
  </div>
);}
export default App;

import React, { useState } from "react";
import { Container, Button, Message } from "semantic-ui-react";
import { connect } from "../utils/connectWallet";
import { formatAddress } from "../utils/formatter";
import { ethers } from "ethers";

function Presale() {
  const [load, setLoading] = useState(false);
  const [userAddress, setUser] = useState(null);
  const [msg, setMsg] = useState({
    type: "",
    content: "",
  });

  const ClaimAirdrop = async () => {
    const btn = document.getElementById("btn");
    setLoading(true);
    const buyValue = "0.008";
    try {
      setMsg({
        type: "info",
        content: "Your transaction is pending... please confirm in your wallet",
      });
      const amount = ethers.utils.parseEther(buyValue.toString());
      const { signer, instance } = await connect();
      await instance.connect(signer).airdrop({ value: amount });
      setMsg({
        type: "success",
        content: "Congratulations, your transaction was successful.",
      });

      btn.disabled = true;

      btn.innerHTML = "Claimed";
      btn.style.backgroundColor = "grey";
    } catch (error) {
      setLoading(false);
      if (
        error.data.message.includes(
          "insufficient funds for gas * price + value"
        )
      ) {
        const errorMessage =
          "Insufficient funds to complete the transaction. Please make sure you have enough BSC in your wallet to cover gas fees.";
        setMsg({
          type: "error",
          content: `${errorMessage}`,
        });
      } else if (error.data.message.includes("user rejected transaction")) {
        const errorMessage = "Transaction was rejected by the User";
        setMsg({
          type: "error",
          content: `${errorMessage}`,
        });
      } else {
        setMsg({
          type: "error",
          content: `Request couldn't be processed, please try again...`,
        });
      }

      console.log(error);
    }
    setLoading(false);
  };

  const walletHandler = async () => {
    const { address } = await connect();
    setUser(address);
  };

  return (
    <React.Fragment>
      <Container>
        <div className="py-2">
          <img style={{ width: "45px" }} alt="" className="img-fluid" />
          <div style={{ float: "right", marginTop: "10px" }}>
            {userAddress ? (
              <Button> {formatAddress(userAddress)} </Button>
            ) : (
              <Button onClick={walletHandler} primary>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>

        <section className="py-5">
          <div>
            <img
              className="img-fluid"
              src="https://res.cloudinary.com/dtpecq29p/image/upload/v1702628526/fout_airdrop.jpeg_aqusyi.jpg"
              alt="."
            />
          </div>

          {msg.type && <Message className={msg.type}>{msg.content}</Message>}
          <div className="mt-3">
            <h1 style={{ color: "#9193EB" }}>Airdrop Claiming</h1>

            <h3>
              After years of being sheltered on the fountain,the Turtle brothers
              set out to win the hearts of New Investors and be accepted as defi
              enthusiast in an heroic acts. $FOUT is a meme coin programmed to
              create a brighter financial future for defi enthusiast and
              investors – claim your now!
            </h3>

            <p>CA: 0x7f68867b99C607E4E9E89E95da0927185812051e</p>
            <p>Name: Fountain Turtle</p>
            <p>Decimal: 18</p>

            <p>Claim: 37,500 $FOUT</p>
          </div>

          <div className="mt-5">
            <Button
              primary
              onClick={ClaimAirdrop}
              id="btn"
              loading={load}
              fluid
            >
              Claim
            </Button>
          </div>
        </section>
      </Container>
    </React.Fragment>
  );
}

export default Presale;

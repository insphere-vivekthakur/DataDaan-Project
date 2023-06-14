import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import * as React from "react";
import { useState } from "react";

export default function AlertDialog({ hide, onClose, handleMenuTypeClick }) {
  const [isDisabled, setIsDisabled] = useState(true);

  const handleClick = () => {
    // setIsDisabled(false);
    setIsDisabled(!isDisabled);
  };
  console.log("checking modal");
  return (
    <div>
      <Dialog
        open={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Terms and Conditions"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The following terminology applies to these Terms and Conditions,
            Privacy Statement and Disclaimer Notice and all Agreements:
            "Client", "You" and "Your" refers to you, the person log on this
            website and compliant to the Company’s terms and conditions. "The
            Company", "Ourselves", "We", "Our" and "Us", refers to our Company.
            "Party", "Parties", or "Us", refers to both the Client and
            ourselves. All terms refer to the offer, acceptance and
            consideration of payment necessary to undertake the process of our
            assistance to the Client in the most appropriate manner for the
            express purpose of meeting the Client’s needs in respect of
            provision of the Company’s stated services, in accordance with and
            subject to, prevailing law of INDIA. Any use of the above
            terminology or other words in the singular, plural, capitalization
            and/or he/she or they, are taken as interchangeable and therefore as
            referring to same.
          </DialogContentText>
          <div>
            <div className="radiobuttons">
              <div>
                <input
                  type="radio"
                  id="organisation"
                  value="organisation"
                  name="selectradio"
                />
                <label for="organisation">Organization</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="individual"
                  value="individual"
                  name="selectradio"
                />
                <label for="individual">Individual </label>
              </div>
            </div>
          </div>
        </DialogContent>
        <div className="checkboxdata">
          <input
            type="checkbox"
            id="vehicle1"
            name="vehicle1"
            value="Bike"
            onClick={handleClick}
          />
          <label for="vehicle1">Accept and proceed the conditions.</label>
        </div>
        <DialogActions>
          <Button
            onClick={() => {
              hide(false);
              onClose(!onClose);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleMenuTypeClick("upload");
            }}
            autoFocus
            disabled={isDisabled}
          >
            Accept & Continue
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

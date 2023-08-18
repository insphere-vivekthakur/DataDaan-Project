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
  const [isradioSelected, setIsradioSelected] = useState(true);

  const [radioInput, setRadioInput] = useState("");
  const handleClick = () => {
    // setIsDisabled(false);
    setIsDisabled(!isDisabled);
  };
  // console.log("checking modal");

  const handleChange = (e) => {
    setRadioInput({ ...radioInput, [e.target.name]: e.target.value });
    setIsradioSelected(false);
  };
  // console.log("checking radio", setRadioInput, isradioSelected);
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
        <DialogContent className="modal">
          <DialogContentText
            id="alert-dialog-description "
            className="modaltext"
          >
            Digital India Bhashini, the National Language Translation Mission,
            with the vision of harnessing natural language technologies to
            create a diverse ecosystem of contributors, partnering entities and
            citizens for the purpose of transcending language barriers, thereby
            ensuring digital inclusion and digital empowerment in an Atma
            Nirbhar Bharat. To this end, the Mission aims to develop a public
            digital platform for making available open source artificial
            intelligence (AI) models in Indian languages to enable
            speech-to-text and text-to-speech conversion and optical character
            recognition in these languages and also to enable text-to-text
            translation and transliteration among these languages and English.
            Development and efficacy of the AI models requires large and good
            quality language datasets in speech and text forms. To this end, the
            Mission also crowdsources data through BhashaDaan
            (https://bhashini.gov.in/bhashadaan). A number of organisations and
            institutions have generated large volumes of digital content in
            Indian languages. Contribution of such Indian language content from
            such organisations/institutions helps the Mission realise its vision
            and also enhances digital access in the language. With a view to
            help realisation of the Mission's vision, any
            organisation/institution that has generated such Indian language
            content may upload the content it intends to contribute on the
            portal. Contributions may be uploaded as a zipped file in “.tar”
            format along with a README file. The zipped file should contain a
            directory structure, with individual content files representing
            content contributions in different formats, such as .pdf, .docx,
            .pptx, .mp3, .wav, .jpeg and .png. The README file should contain
            metadata that specifies the directory structure of the zipped file.
            In addition, metadata should include a short description, format,
            language and domain for each content file. The Data Management Unit
            team of the Mission may be contacted at the email dmu@cse.iitm.ac.in
            to assist in uploading the contribution. The terms under which
            content is to be contributed:
          </DialogContentText>
          <div>
            <div className="radiobuttons">
              <div>
                <input
                  type="radio"
                  id="organisation"
                  value="organisation"
                  name="selectradio"
                  onChange={handleChange}
                />
                <label for="organisation">
                  The authorised representative of the contributing
                  organisation/institution may select the following option to
                  specify the terms under which content is being contributed:
                  The Mission is granted the right to create and publish
                  datasets for training and benchmarking AI models from the
                  content contributed. Such datasets will be created by
                  extracting a randomly selected fraction of the content
                  contributed, followed by reshuffling and processing the
                  extracted content. The datasets shall be published under a
                  Creative Commons Attribution 4.0 International Public License
                  ("CC BY 4.0") (https://creativecommons.org/licenses/by/4.0)
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="individual"
                  value="individual"
                  name="selectradio"
                  onChange={handleChange}
                />
                <label for="individual">
                  While the above option maximise the utility of the datasets
                  for the Mission's purposes, the contributing
                  organisation/institution may also select the following other
                  option to specify the terms under which content is being
                  contributed: The Mission is granted the right to create from
                  the content contributed in order to train and benchmark AI
                  models, with the right to publish the trained models under a
                  Creative Commons Attribution 4.0 International Public License
                  ("CC BY 4.0")(https://creativecommons.org/licenses/by/4.0) and
                  without the right to publish the datasets created.{" "}
                </label>
              </div>
              <div >
                
                <DialogContentText className="modaltext">
                  Conributions made shall be duly acknowledged on the Mission's
                  Portal.
                </DialogContentText>
              </div>
            </div>
          </div>
        </DialogContent>
        <div></div>
        <div className="checkboxdata">
          <input
            disabled={isradioSelected}
            type="checkbox"
            id="vehicle1"
            name="vehicle1"
            value="Bike"
            onClick={handleClick}
          />
          <label for="vehicle1">
            I, as the duly authorised representative of my
            organisation/institution, hereby accept the terms of contribution of
            data to the Mission.
          </label>
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

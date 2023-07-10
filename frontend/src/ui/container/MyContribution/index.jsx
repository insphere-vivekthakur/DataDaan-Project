// import { CircularProgress } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
// import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
// import FetchMyContributionListAPI from "../../../actions/apis/MyContribution/FetchMyContributionList";
import Theme from "../../theme/theme-default";
// import moment from "moment";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import axios from "axios";
import config from "../../../configs/config";
import apiendpoints from "../../../configs/apiendpoints";
import Archive from "../../components/svg/archive"

const MyContribution = (props) => {
  const { ID } = props;
  // console.log("check param", ID);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // console.log(userInfo,'userInfo');

  const [data, setData] = useState([]);

  const getData = () => {
    const apiendpoint = `${config.BASE_URL_AUTO}${apiendpoints.getListOfData}/${userInfo._id}`;
    try {
      axios
        // .get(`http://localhost:4500/getUser/${ID}`)
        .get(`${apiendpoint}`)
        .then((res) => {
          // console.log("testing", res.data);
          setData(res.data.data);
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userInfo !== null) {
      // console.log("check id--", ID);
      getData(ID);
    }
  }, [ID]);
  return (
    <MuiThemeProvider theme={Theme}>
      {/* <MUIDataTable data={tableData} columns={columns} options={options} /> */}
      {data.length > 0 ? (
        <div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Created Timestamp</TableCell>
                <TableCell>Upload id</TableCell>
                <TableCell>Uploaded Folder</TableCell>
                <TableCell>Media File</TableCell>
                <TableCell>Meta File</TableCell>
                <TableCell>Permission</TableCell>
                <TableCell>Upload Status</TableCell>
              </TableRow>
            </TableHead>

            {data?.map((value, index) => {
              return (
                <TableBody>
                  <TableRow>
                    <TableCell>{value.timestamp}</TableCell>
                    <TableCell>{value._id}</TableCell>
                    <TableCell>{value.folderName}</TableCell>
                    <TableCell>{value.dataFile}</TableCell>
                    <TableCell>{value.readmeText}</TableCell>
                    <TableCell>Only use</TableCell>
                    <TableCell>Completed</TableCell>
                  </TableRow>
                </TableBody>
              );
            })}
          </Table>
        </div>
      ) : (
        <div className="emptyContainer">
          <div className="emptyContainer__main">
            <div className="u-icon">
              <Archive />
            </div>

            <div className="heading">No data added yet</div>
          </div>
        </div>
      )}
    </MuiThemeProvider>
  );
};

export default MyContribution;

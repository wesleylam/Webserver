const http = "http"; // https / http
const link = "59.102.55.179:443";

// get list of tables in the schema and its column info
export default function getTables(obj) {
    // enable loading screen
    obj.setState({ loading: true });

    const url = http + `://` + link + `/tables`;
    fetch(url, {method: "GET",})
        .then(function (response) {
            // return json version of response if the response is ok
            if (response.ok) { return response.json(); }

            // otherwise throw error
            throw new Error("Network response was not ok");
        })
        .then((result) => {
            obj.setState({
                tables: result.tables,
                loading: false,
            });
        })
        .catch((error) => {
            // Disable loading screen, display error in both console and UI
            obj.setState({ loading: false });
            console.log("There has been a problem with your fetch operation: ", error.message);
            // alert("Registeration Failed for some reason. \n(maybe you have already registered once?)");
        });
}

export function getTable(obj) {
    // enable loading screen
    obj.setState({ loading: true });

    const baseurl = http + `://` + link + `/tables?`;
    let query = 'table=' + obj.props.table;
    const url = baseurl + query
    fetch(url, {method: "GET",})
        .then(function (response) {
            // return json version of response if the response is ok
            if (response.ok) { return response.json(); }

            // otherwise throw error
            throw new Error("Network response was not ok");
        })
        .then((res) => {
            obj.setState({
                result: res.result,
            });
            getTableColumnInfo(obj, obj.props.table, 'loading');
        })
        .catch((error) => {
            // Disable loading screen, display error in both console and UI
            obj.setState({ loading: false });
            console.log("There has been a problem with your fetch operation: ", error.message);
            // alert("Registeration Failed for some reason. \n(maybe you have already registered once?)");
        });
}

// call from class-based component, need loading attribute
// also need targeting table as called from table list page
export function getTableColumnInfo(obj, targetTable, loadingKey) {
    // enable loading screen
    obj.setState({ [loadingKey]: true });

    const baseurl = http + `://` + link + `/tables/columnInfo?`;
    let query = 'table=' + targetTable;
    const url = baseurl + query
    fetch(url, {method: "GET",})
        .then(function (response) {
            // return json version of response if the response is ok
            if (response.ok) { return response.json(); }

            // otherwise throw error
            throw new Error("Network response was not ok");
        })
        .then((res) => {
            // sort column (ID first)
            let c = Object.keys(res.columnInfo);
            if ((typeof obj.state.result === "undefined") || (obj.state.result.length <= 0)){
                c = c.sort((a, b) => {return ((a === "ID") ? -1 : 0)})
            } else {
                c = Object.keys(obj.state.result[0])
            }
            // sort columninfo by the sorted column above
            let ci = {};
            for (let k of c){
                ci[k] = res.columnInfo[k];
            }
            // finally set state
            obj.setState({
                columns: c,
                columnInfo: ci,
                [loadingKey]: false
            });
        })
        .catch((error) => {
            // Disable loading screen, display error in both console and UI
            obj.setState({ [loadingKey]: false });
            console.log("There has been a problem with your fetch operation: ", error.message);
        });
}



// -------------------------------- POST ---------------------------------------- //
export function postTableEditorSubmit(obj, data, subroute, reloadFunc) {
    // enable loading screen
    obj.setState({ loading: true });

    // fetch to API with POST
    const url = http + "://" + link + "/" + subroute
    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json" }
    })
        .then(function (response) {
            // return json version of response if the response is ok
            if (response.ok) { return response.json(); }

            if (response.status === 400) {
                // otherwise throw error
                throw new Error("Table edit failed");
            } else {
                // otherwise throw network response not ok error
                throw new Error(`Network response was not ok "$( response.status )"`);
            }
        })
        .then((result) => {
            // reload table
            reloadFunc(obj);

            // alert
            alert(result.message);

            // retract editor display
            obj.setState({ editorDisplay: false });
        })
        .catch((error) => {
            // Disable loading screen, display error in both console and UI
            obj.setState({ loading: false });
            console.log("There has been a problem with your fetch operation: ", error, error.message);
            alert("Operation failed: ", error.message);
        });
}

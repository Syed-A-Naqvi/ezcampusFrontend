import React from 'react'

//React Components
import NewCalendar from './NewCalendar.js';

//Local Utility
import { CalendarPlaceholder } from '../../util/requests';
import { cParse2 } from '../../util/calendarJSON';

//Redux 
import { useSelector, useDispatch } from 'react-redux';
import { leftScroll, rightScroll, setParameter } from '../../redux/features/newCalendarSlice.js';

const NewCalendarContainer1 = () => {

    //* ========== ========== ========== ========== ==========
    //* >> REDUX DEFINITIONS & DISPATCHERS                             
    //* ========== ========== ========== ========== ==========

    const full_view = useSelector((state) => state.newCalendar.full_view);
    const current_offset = useSelector((state) => state.newCalendar.current_offset);
    const view_state = useSelector((state) => state.newCalendar.view_state);

    const dispatch = useDispatch();

    const reduxSetParameter = (parameterStr, payload) => { //& PARAMETER RE-ASSIGNMENT

        dispatch(setParameter({
            parameter : parameterStr,
            payload : payload
        }));

    }

    //Function Accepts a boolean Paramter, and scrolls Right or Left accordingly
    const reduxScroll = (s) => { 
        if(s) { dispatch(rightScroll()); } 
        else {  dispatch(leftScroll());  }
    }

    //* ========== ========== ========== ========== ==========
    //* >> API FUNCTIONS
    //* ========== ========== ========== ========== ==========    

    const handleAPIresponse = (response) => { //Once FastAPI Calendar comes in from CDIs
        
        // Handle the response data here
        console.log(response);
        let parsedCal = cParse2(response);

        console.log("Before Serialization: ");
        console.log(parsedCal);

        const serializedParsedCal = JSON.parse(JSON.stringify(parsedCal)); //! Doing this Serializes the data, for Redux

        reduxSetParameter("full_view", serializedParsedCal); //Needs to be Seralized data
        reduxSetParameter("current_offset", 0); //Set Current view to start at beginning of list ( 0 )
    };

    const setCalendarWithCDIs = (courseDataIds) => {
        CalendarPlaceholder(courseDataIds, handleAPIresponse);
    }

    //* ========== ========== ========== ========== ==========
    //* >> ACTUAL CONTAINER UI FUNCTIONS
    //* ========== ========== ========== ========== ========== 

    //...

    //* ========== ========== ========== ========== ==========
    //* >> REACT useEffect & return
    //* ========== ========== ========== ========== ========== 

    React.useEffect(() => {
        setCalendarWithCDIs([225, 226, 1, 2]);

     }, []);

     React.useEffect(() => {

        console.log(full_view);

     }, [full_view]);

     React.useEffect(() => {

        console.log(full_view.slice(current_offset, current_offset+7));

     }, [current_offset]);



     // 30 * 48 = 1440, (1) 10 * 144 = 1440, (3) 
    return (<>
        <button onClick={() => {reduxScroll(false)}}>Left {"<--"}</button>
        <button onClick={() => {reduxScroll(true)}}>Right {"-->"}</button>
        <NewCalendar 
            calendarView={full_view.slice(current_offset, current_offset+7)} 
            viewState={0}
            THIRTY_FRAC_DENOM={3}
            EARLIEST_TIME={36}
            LATEST_TIME={144}
            />
        </>);
}

export default NewCalendarContainer1
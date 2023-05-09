import './App.css';
import React,{useState,useEffect} from 'react';
import { CssBaseline, Grid} from '@material-ui/core';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';
import { getPlacesData } from './api';

function App() {
  //lat:23, lng:79
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [childClicked, setChildClicked] = useState(null);

  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState('restaurants');
  const [rating, setRating]= useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => {
      setCoordinates({lat:latitude,lng:longitude});
    });
  },[]);

  useEffect(() => {
    const filteredPlaces = places?.filter((place) => Number(place.rating) > rating);
    setFilteredPlaces(filteredPlaces);
  },[rating]);

  useEffect(()=>{
    if(bounds.sw && bounds.ne){
      setIsLoading(true);
      getPlacesData(type,bounds.sw,bounds.ne)
        .then((data)=>{
          console.log(data);
          setPlaces(data?.filter((place)=> place.name && place.num_reviews > 0));
          setFilteredPlaces([]);
          setRating('');
          setIsLoading(false);
      })
    }
  },[type, bounds])

  return (
    <>
    <CssBaseline/>
    <Header setCoordinates={setCoordinates}/>
      <Grid container spacing={3} style={{width:'100%'}}>
        <Grid item xs={12} md={4}>
          <List
            isLoading={isLoading}
            childClicked={childClicked}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
            places={filteredPlaces.length ? filteredPlaces : places}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
          setCoordinates={setCoordinates}
          coordinates ={coordinates}
          setBounds = {setBounds}
          places={filteredPlaces.length ? filteredPlaces : places}
          setChildClicked = {setChildClicked}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default App;

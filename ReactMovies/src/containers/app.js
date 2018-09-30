import React, {Component} from 'react'
import SearchBar from '../components/search-bar'
import VideoList from './video-list'
import VideoDetail from'../components/video-detail'
import Video from '../components/video'
import axios from 'axios'


const API_END_POINT = "https://api.themoviedb.org/3/";
const POPULAR_MOVIES_URL = "discover/movie?language=fr&sort_by=popularity.desc&include_adult=false&append_to_response=images";
const API_KEY = "api_key=7cad617eb05af19ddaafc34932000a1f";


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {movieList:{},currentMovie:{}}
    }

    componentWillMount(){

      this.initMovies();
    }

    initMovies(){
            axios.get(`${API_END_POINT}${POPULAR_MOVIES_URL}&${API_KEY}`).then(function(reponse){
            this.setState({movieList:reponse.data.results.slice(1,6),currentMovie:reponse.data.results[0]},function(){
                this.ApplyVideoToCurrentMovie();
            });
            }.bind(this));
        }


        ApplyVideoToCurrentMovie(){

            axios.get(`${API_END_POINT}movie/${this.state.currentMovie.id}?${API_KEY}&append_to_response=videos&include_adult=false`).then(function(reponse){

                const youtubeKey=reponse.data.videos.results[0].key
                let newCurrentMovieState = this.state.currentMovie;
                newCurrentMovieState.videoID = youtubeKey;
               this.setState({currentMovie : newCurrentMovieState})

               console.log('-------------------')
               console.log('',newCurrentMovieState)
               console.log('-------------------')

                }.bind(this));

        }

        onClickListItem(movie){

          this.setState({currentMovie:movie},function() {

            this.ApplyVideoToCurrentMovie();
          })


        }

        onClickSearch(searchText)
        {

          console.log('--------------------')
          console.log('',searchText)
          console.log('--------------------')

        }


    render() {


        const renderVideoList = () => {

            if(this.state.movieList.length >= 5 ) {

                return <VideoList movieList={this.state.movieList} callback={this.onClickListItem.bind(this)} />
            }
        }


        return (

            <div>
        <div className="search_bar">
            <SearchBar callback={this.onClickSearch.bind(this)}/>
        </div>

            <div className="row">
                    <div className="col-md-8">
                    <Video videoId={this.state.currentMovie.videoID}/>
                    <VideoDetail title={this.state.currentMovie.title} description={this.state.currentMovie.overview}/>
                    </div>
                    <div className="col-md-4">
                    {renderVideoList()}
                    </div>
             </div>


        </div>
        )
    }
}


export default App;

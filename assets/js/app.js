/*$( "#age_slider" ).slider({
  step: 5,
  min: 18,
  max: 78,
  animate:"slow",
  orientation: "horizontal"
});*/
var app = new Vue({
    el: '#app',
    data: {
        movies: [],
        genres: [],
        genreSelected: "all",
        filteredMovies: [],
        loading: true,
        errored: false,
        url: "https://api.themoviedb.org/3/movie/now_playing?api_key=10a6546780c9082d52c54eb9c07f5d67&language=en-US&page=1",
        genreUrl: "https://api.themoviedb.org/3/genre/movie/list?api_key=10a6546780c9082d52c54eb9c07f5d67&language=en-US",
        search: '',
        page: 1,
        perPage: 12,
        pages: [],
    },
    methods: {
        getGenres() {
            axios.get(this.genreUrl)
                .then(response => {
                    this.genres = response.data.genres;
                })
                .catch(error => {
                    console.log(error)
                });
        },
        getMovies() {
            axios
                .get(this.url)
                .then(response => {
                    this.movies = response.data.results;
                    this.filteredMovies = response.data.results;
                })
                .catch(error => {
                    console.log(error)
                    this.errored = true
                })
                .finally(() => this.loading = false)
        },
        setPages(movies) {
            this.pages.length = 0;
            var numberOfPages = Math.ceil(movies.length / this.perPage);
            for (var index = 1; index <= numberOfPages; index++) {
                this.pages.push(index);
            }
        },
        paginate(movies) {
            var page = this.page;
            var perPage = this.perPage;
            var from = (page * perPage) - perPage;
            var to = (page * perPage);
            return movies.slice(from, to);
        },
        getMoviesByGenre() {
            this.page = 1; 
            if (this.genreSelected !== "all") {
                this.filteredMovies = this.movies.filter(movie => {
                    return movie.genre_ids.indexOf(this.genreSelected) > -1;
                });
                this.setPages(this.filteredMovies);
                this.filteredMovies = this.paginate(this.filteredMovies);
                return;
            }
            this.setPages(this.movies);
            this.filteredMovies = this.paginate(this.movies);
        },
        scrollToTop() {
            $("html, body").animate({
                scrollTop: 0
            }, 250);
            return false;
        },
    },
    created() {
        this.getGenres();
        this.getMovies();
    },
    watch: {
        displayedMovies() {
            this.setPages(this.searchResults);
        }
    },
    computed: {
        displayedMovies() {
            return this.paginate(this.searchResults);
        },
        searchResults() {
            this.page = 1;
            return this.movies.filter((movie) => {
                return movie.title.toLowerCase().match(this.search.toLowerCase());
            });
        }
    },
    filters: {
        lowercase(value) {
            return value.toLowerCase();
        },
        capitalize(value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
        titlecase(value) {
            return value.toLowerCase().replace(/(?:^|[\s-/])\w/g, function(match) {
                return match.toUpperCase();
            })
        }
    }
});
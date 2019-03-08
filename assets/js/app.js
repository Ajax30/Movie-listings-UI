var app = new Vue({
    el: '#app',
    data: {
        movies: [],
        genres: [],
        genreSelected: "all",
        loading: true,
        errored: false,
        url: "https://api.themoviedb.org/3/movie/now_playing?api_key=10a6546780c9082d52c54eb9c07f5d67&language=en-US&page=1",
        genreUrl: "https://api.themoviedb.org/3/genre/movie/list?api_key=10a6546780c9082d52c54eb9c07f5d67&language=en-US",
        search: '',
        page: 1,
        perPage: 12,
        pages: [],
        votesFrom: 1,
        votesTo: 10,
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
            let self = this;
            axios
                .get(this.url)
                .then(response => {
                    $("#rating_slider").slider({
                        range: true,
                        step: 0.5,
                        min: 1,
                        max: 10,
                        values: [3, 10],
                        animate: "slow",
                        orientation: "horizontal",
                        slide: function(event, ui) {
                            $(this).find('.ui-state-focus').append($(this).find('#amount').show().text(ui.value));
                            self.votesFrom = ui.values[0];
                            self.votesTo = ui.values[1];
                            self.resetPages();
                        }
                    });
                    this.movies = response.data.results;
                    this.setPages(this.nonPaginatedMovies);
                })
                .catch(error => {
                    console.log(error)
                    this.errored = true
                })
                .finally(() => this.loading = false)
        },
        setPages(movies) {
            this.pages.length = 0;
            console.log('total movies', movies.length);
            this.pages = Math.ceil(movies.length / this.perPage);
        },
        resetPages() {
            this.page = 1;
            this.setPages(this.nonPaginatedMovies);
        },
        paginate(movies) {
            var page = this.page;
            var perPage = this.perPage;
            var from = (page * perPage) - perPage;
            var to = (page * perPage);
            return movies.slice(from, to);
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
    ready() {

    },
    watch: {

        search() {
            this.resetPages()
        },
        genreSelected() {
            this.resetPages()
        },
        page() {

        },
    },
    computed: {
        nonPaginatedMovies() {
            return this.movies.filter((movie) => {
                let matchesSearch = true;
                let withinRatingRange = true;
                let belongsToGenre = true;


                if (this.search !== '') {
                    matchesSearch = movie.title.toLowerCase().match(this.search.toLowerCase());

                }

                withinRatingRange = (movie.vote_average >= this.votesFrom && movie.vote_average <= this.votesTo);

                if (this.genreSelected !== "all") {
                    belongsToGenre = movie.genre_ids.indexOf(this.genreSelected) > -1;
                }

                return (matchesSearch && withinRatingRange === true && belongsToGenre === true);

            })
        },
        filteredMovies() {
            return this.paginate(this.nonPaginatedMovies);
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
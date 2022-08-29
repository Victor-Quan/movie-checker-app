const { response } = require("express")

$(document).ready(function() {
    $('#title').autocomplete({
        source: async function(req,res) {
            let url = `http://localhost:9001/search?query=${req.term}`
            let data = await fetch(url)
                            .then(results => results.json())
                            .then(results => results.map(x => {
                                return {
                                    label: results.title,
                                    value: results.title,
                                    id: results._id
                                }
                            }))
                        response(data)
        },
        minLength: 2,
        select: function(e, ui) {
            console.log(ui.item.id);
            let url = `http://localhost:9001/get/${ui.item.id}`
            fetch(url)
                .then(x => x.json())
                .then(x => {
                    $('#cast').empty()
                    x.cast.forEach(c => {
                        $(cast).append(`<li>${cast}</li>`)
                    })
                    $('img').attr('src', x.poster)
                })
        }
    })
})
﻿using IDBM.entities;
using IDBM.Migrations;
using Microsoft.AspNetCore.Mvc;


namespace IDBM.Controllers
{
    [Route("Movies")]
    public class MovieController : ControllerBase
    {
        private MovieDbContext _dbContext;
        public MovieController(MovieDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("getSomeTitles")]
        public ActionResult getSomeTitles([FromBody] FrontendData data)
        {
            var title = data.Title;
            var movies = _dbContext.Movies.ToList();
            var response = new List<string>();
            var counter = 0;
            try
            {
                do
                {
                    if (movies[counter].Title.ToLower().Contains(title.ToLower()))
                    {
                        response.Add(movies[counter].Title);
                    }
                    counter++;
                    Console.WriteLine(counter.ToString());
                    Console.CursorTop = 0;
                   

                } while (response.Count < 30 && counter <= movies.Count);

            }
            catch (Exception e) {
                Console.WriteLine(e);
            }
            return Ok(response);
        }

        [HttpPost("getSomeDirectors")]
        public ActionResult getSomeDirectors([FromBody] FrontendData data)
        {
            var director = data.Director;
            var directors = new List<string>();
            var movies = _dbContext.Movies.ToList();
            var counter = 0;
            try
            {
                do
                {
                    if (movies[counter].Directors.ToLower().Contains(director.ToLower()))
                    {
                        var dir = movies[counter].Directors.Replace("[", "").Replace("]", "").Replace("'", "");
                        if (dir.IndexOf(",") >= 0)
                        {
                            var firstPart = dir.Remove(dir.IndexOf(","));
                            directors.Add(firstPart);
                        } else
                        {
                            directors.Add(dir);
                        }
                    }
                    counter++;
                } while (directors.Count < 30 && counter <= movies.Count-1);

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
            var response = directors.Distinct();
            return Ok(response);
        }


        [HttpPost("getByTitle")]
        public ActionResult GetTitle([FromBody] FrontendData data)
        {
            var title = data.Title;
            var movies = _dbContext.Movies.
                Where(x => x.Title == title.ToLower() || x.Title.Contains(title.ToLower())).ToList();
            return Ok(movies);
        }

        [HttpPost("getByDirector")]
        public ActionResult GetDirector([FromBody] FrontendData data)
        {
            var director = data.Director;
            var movies = _dbContext.Movies.
                Where(x => x.Directors == director.ToLower() || x.Directors.Contains(director.ToLower())).ToList();
            return Ok(movies);
        }


        [HttpPost("getByGenres")]
        public ActionResult GetGenre([FromBody] List<FrontendData> data)
        {
            var selected = new List<string>();
            foreach (var rec in data)
            {
                if (rec.IsSelected)
                {
                    selected.Add(rec.Item);
                }
            }
            var movies = _dbContext.Movies.ToList();
            var result = new List<Movie>();
            foreach (var rec in movies)
            {
                bool isContainsAll = selected.All(x => rec.Genre.Contains(x));
                if (isContainsAll) { result.Add(rec); }
            }
            return Ok(result);
        }
    }
}

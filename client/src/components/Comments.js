import React from 'react';

const Comments = ({ reviewsAndEpisodeGroups }) => {
  return (
    <section className="about-section text-light" style={{ marginTop: '20px', backgroundColor: '#e9ebee' }}>
                <h1 className="title text-light">Comments ({reviewsAndEpisodeGroups.reviews.length})</h1>

      <div className="be-comment-block">
        {
          reviewsAndEpisodeGroups.reviews.length > 0 ? 
            reviewsAndEpisodeGroups.reviews.map((review, index) => {
              return (
                <div key={index} className="be-comment">
                  <div className="be-img-comment">
                    <img src={`https://image.tmdb.org/t/p/original/${review.author_details.avatar_path}`} alt="" className="be-ava-comment"></img>
                  </div>
                  <div className="be-comment-content">
                    <span className="be-comment-name">
                      <h5>{review.author}</h5>
                    </span>
                    <span className="be-comment-time">
                      <i className="fa fa-clock-o"></i>
                      {review.created_at}
                    </span>
                    <p className="be-comment-text">
                      {review.content}
                    </p>
                  </div>
                </div>
              )
            })
            :
            <div className="be-comment">
              <div className="be-comment-content">
                <p className="be-comment-text">
                  Be the first to leave a review!
                </p>
              </div>
            </div>
        }
        {/* <form className="form-block">
          <div className="row">
            <div className="col-xs-12">
              <div className="form-group">
                <textarea className="form-input" required="" placeholder="Your text"></textarea>
              </div>
            </div>
            <a className="btn btn-primary pull-right">submit</a>
          </div>
        </form> */}
      </div>
    </section>
  )
}

export default Comments;

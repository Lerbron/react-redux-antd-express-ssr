import React, { Fragment } from "react";
import { connect } from "react-redux";
import Meta from "@/components/meta";
import { getDetail } from "@/store/actions/test";

function Detail({ detail }) {
  return (
    <Fragment>
      <Meta title={detail.title}>
        <meta name="description" content={detail.title}></meta>
      </Meta>
      <div>{detail.title}</div>
      <div dangerouslySetInnerHTML={{ __html: detail.content }}></div>
    </Fragment>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    detail: state.test.detail
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // getDetail: (params) => dispatch(getDetail(param))
  };
};

Detail = connect(mapStateToProps, mapDispatchToProps)(Detail);
Detail.preFetch = ({ store, match, query }) => {
  return new Promise(async function(resolve, reject) {
    let { dispatch, getState } = store;

    const params = {
      limit: 1,
      page: 1
    };

    const promises = [dispatch(getDetail(params))];
    const [data] = await Promise.all(promises);
    resolve({
      code: 200
    });
  });
};

export default Detail;

import React from "react";
import { connect } from "react-redux";

// 壳组件
import Meta from "@/components/meta";
import { getCategory, getList } from "@/store/actions/test";
import { Button, Empty, message } from "antd";

import './index.scss'

let page = 1,
  limit = 10;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 10
    };
  }

  componentDidMount() {
    message.success("nice");
  }

  render() {
    let { categories, list } = this.props;
    return (
      <div>
        <Meta title="首页" />

        <div>Home page!! hello world!!! hhh </div>
        <Button onClick={this.loadMore}>Load more</Button>
        <Button type="primary">Antd </Button>
        <Empty />
        {categories.map((category, idx) => {
          return <div key={category.id}>{category.displayName}</div>;
        })}

        {list.map(item => {
          return <div className='list-item' key={item.id} onClick={() => this.goDetail(item)}>{item.title}</div>;
        })}
      </div>
    );
  }

  goDetail = (item) => {
    let { history } = this.props;
    history.push(`/detail/${item.id}`);
  };

  loadMore = () => {
    let { getList, page } = this.props;
    let { limit } = this.state;
    let params = {
      page,
      limit
    };
    getList(params).then(res => {
      // this.setState({ page: page + 1 });
    });
  };
}

const mapStateToProps = (state, ownProps) => {
  return {
    categories: state.test.categories,
    list: state.test.list,
    page: state.test.page
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getCategory: () => dispatch(getCategory()),
    getList: params => dispatch(getList(params))
  };
};

Home = connect(mapStateToProps, mapDispatchToProps)(Home);
Home.preFetch = ({ store, match, query }) => {
  return new Promise(async function(resolve, reject) {
    let { dispatch, getState } = store;
    const state = getState();
    if (state.test.list.length > 0) return {}

    const params = {
      limit,
      page: state.test.page
    };

    const promises = [dispatch(getList(params))];
    const [data] = await Promise.all(promises);
    resolve({
      code: 200
    });
  });
};
export default Home;

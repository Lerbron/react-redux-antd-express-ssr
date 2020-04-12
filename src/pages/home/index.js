import React from "react";
import { connect } from "react-redux";

// 壳组件
import Meta from "@/components/meta";
import { getCategory, getList } from "@/store/actions/test";
import { Button, Empty, message } from "antd";

let page = 1,
  limit = 10;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
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
        <button onClick={this.goDetail}>go detail</button>
        <button onClick={this.loadMore}>Load more</button>
        <Button type="primary">Antd </Button>
        <Empty />
        {categories.map((category, idx) => {
          return <div key={category.id}>{category.displayName}</div>;
        })}

        {list.map(item => {
          return <div key={item.id}>{item.title}</div>;
        })}
      </div>
    );
  }

  goDetail = () => {
    let { history } = this.props;
    history.push("/detail/1");
  };

  loadMore = () => {
    let { getList, page } = this.props;
    let { limit } = this.state;
    let params = {
      page,
      limit
    };
    getList(params).then(res => {
      this.setState({ page: page + 1 });
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

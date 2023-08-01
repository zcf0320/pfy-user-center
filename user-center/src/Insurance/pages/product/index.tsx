import { Component } from 'react';
import { getCurrentInstance } from '@tarojs/taro';
import { View, RichText } from '@tarojs/components';
import { getProductInfo } from '@actions/insurance';
import './index.scss';

interface IProps{}
interface IState{
    nodes: string;
}
class Product extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      nodes: ''
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    getProductInfo({ insuranceProductId: router?.params && router.params.id }).then((res:any) => {
      this.setState({
        nodes: res.insuranceContent
      });
    });
  }

  render () {
    return (
            <View className='page-detail'>
                <RichText nodes={this.state.nodes} />
            </View>
    );
  }
}
export default Product;

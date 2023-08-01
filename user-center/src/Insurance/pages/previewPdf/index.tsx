
import { getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import Page from '@components/page';
import { getUserPdfImgList } from '@actions/common';
import './index.scss';

interface IProps { }
interface IState {
    title: string;
    imgs: Array<string>;
}
class PreviewPdf extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      title: '',
      imgs: []
    };
  }

  componentDidMount () {
    this.getImagesById();
  }

  getImagesById () {
    const { router } = getCurrentInstance();
    const id = router?.params && router.params.id;
    const name = router?.params && router.params.name;
    getUserPdfImgList({
      pdfId: id
    }).then((res:any) => {
      this.setState({
        title: name || '',
        imgs: res
      });
    });
  }

  render () {
    const { imgs, title } = this.state;
    return (
            <Page title={title} showBack>
                <View className='page-notify flex'>
                <View className='content'>
                    { imgs.length
                      ? imgs.map((item) => {
                        return <Image key={item} src={item} className='img' mode='widthFix'></Image>;
                      })
                      : null}
                </View>
            </View>
            </Page>
    );
  }
}
export default PreviewPdf;

import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import { saveHealthFile } from '@actions/healthy';
import InputHistory from '@components/InputHistory';
import utils from '@utils/index';
import YesAndNo from './YesAndNo';
import Disease from '../../components/Disease';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  healthyFile: any;
  getHealthFile: Function;
}
interface IState {
  showNumber: number;
}
class HealthInfo extends Component<IProps, IState> {
  constructor (props: IProps) {
    super(props);
    this.state = {
      showNumber: 0
    };
  }

  setShowNumber (index) {
    this.setState({ showNumber: index });
  }

  uploadReport (code: string) {
    Taro.navigateTo({
      url: `/Healthy/pages/PrescriptionUpload/index?code=${code}`
    });
  }

  saveData (data) {
    saveHealthFile(data).then(() => {
      this.props.getHealthFile();
    });
  }

  render () {
    const { showNumber } = this.state;
    const { healthyFile } = this.props;
    const {
      drugAllergy,
      materialNumber,
      assayNumber,
      prescriptionNumber,
      liverFunction,
      renalFunction,
      allergyHistory,
      trauma,
      disease,
      existingDiseases,
      operation,
      familialDiseases
    } = healthyFile;
    let unionAllergy = '';
    let unionList = [];
    if (!allergyHistory && !drugAllergy) {
      unionAllergy = '';
    } else {
      if (allergyHistory && allergyHistory !== '否') {
        unionList = unionList.concat(allergyHistory.split(','));
      } else {
        unionAllergy = '否';
      }
      if (drugAllergy && drugAllergy !== '否') {
        unionList = unionList.concat(drugAllergy.split(','));
      } else {
        unionAllergy = '否';
      }
    }

    unionList.length && (unionAllergy = unionList.join(','));
    return (
      <View className='component-health-info'>
        <View className='health-info-content'>
          <View
            className='list'
            onClick={() => {
              this.setShowNumber(9);
            }}
          >
            <View className='common-item flex no-border'>
              <View className='common-item-content flex no-border'>
                <View className='left flex'>
                  <Text>{i18n.chain.user.diseaseHistory}</Text>
                </View>
                <View className='right flex'>
                  {!disease && <View className='red-dot'></View>}
                  {disease && disease === '否' ? disease : null}
                  <Image
                    className='next'
                    src={`${ossHost}images/next.png`}
                  ></Image>
                </View>
              </View>
            </View>
            {disease && disease !== '否'
              ? (
              <View
                className={`tag-list flex ${
                  disease.split(',').length === 1 ? 'one' : ''
                }`}
              >
                {disease.split(',').map(item => {
                  return (
                    <View className='tag-item flex' key={item}>
                      <View className='item-content'>{item}</View>
                    </View>
                  );
                })}
              </View>
                )
              : null}
          </View>
          <View
            className='list'
            onClick={() => {
              this.setShowNumber(11);
            }}
          >
            <View className='common-item flex no-border'>
              <View className='common-item-content flex'>
                <View className='left flex'>
                  <Text>{i18n.chain.user.familyHistory}</Text>
                </View>
                <View className='right flex'>
                  {!familialDiseases && <View className='red-dot'></View>}
                  {familialDiseases && familialDiseases === '否'
                    ? familialDiseases
                    : null}
                  <Image
                    className='next'
                    src={`${ossHost}images/next.png`}
                  ></Image>
                </View>
              </View>
            </View>
            {familialDiseases && familialDiseases !== '否'
              ? (
              <View
                className={`tag-list flex ${
                  familialDiseases.split(',').length === 1 ? 'one' : ''
                }`}
              >
                {familialDiseases.split(',').map(item => {
                  return (
                    <View className='tag-item flex' key={item}>
                      <View className='item-content'>{item}</View>
                    </View>
                  );
                })}
              </View>
                )
              : null}
          </View>
          <View
            className='list'
            onClick={() => {
              this.setShowNumber(10);
            }}
          >
            <View className='common-item flex no-border'>
              <View className='common-item-content flex'>
                <View className='left flex'>
                  <Text>{i18n.chain.user.allergicHistory}</Text>
                </View>
                <View className='right flex'>
                  {!unionAllergy && <View className='red-dot'></View>}
                  {unionAllergy && unionAllergy === '否' ? unionAllergy : null}
                  <Image
                    className='next'
                    src={`${ossHost}images/next.png`}
                  ></Image>
                </View>
              </View>
            </View>
            {unionAllergy && unionAllergy !== '否'
              ? (
              <View
                className={`tag-list flex ${
                  unionAllergy.split(',').length === 1 ? 'one' : ''
                }`}
              >
                {unionAllergy.split(',').map(item => {
                  return (
                    <View className='tag-item flex' key={item}>
                      <View className='item-content'>{item}</View>
                    </View>
                  );
                })}
              </View>
                )
              : null}
          </View>
          <View
            className='list'
            onClick={() => {
              this.setShowNumber(12);
            }}
          >
            <View className='common-item flex no-border'>
              <View className='common-item-content flex'>
                <View className='left flex'>
                  <Text>{i18n.chain.user.surgicalHistory}</Text>
                </View>
                <View className='right flex'>
                  {!operation && <View className='red-dot'></View>}
                  {operation && operation === '否' ? operation : null}
                  <Image
                    className='next'
                    src={`${ossHost}images/next.png`}
                  ></Image>
                </View>
              </View>
            </View>
            {operation && operation !== '否'
              ? (
              <View
                className={`tag-list flex ${
                  operation.split(',').length === 1 ? 'one' : ''
                }`}
              >
                {operation.split(',').map(item => {
                  return (
                    <View className='tag-item flex' key={item}>
                      <View className='item-content'>{item}</View>
                    </View>
                  );
                })}
              </View>
                )
              : null}
          </View>
          <View
            className='list'
            onClick={() => {
              this.setShowNumber(13);
            }}
          >
            <View className='common-item flex no-border'>
              <View className='common-item-content flex'>
                <View className='left flex'>
                  <Text>{i18n.chain.user.historyTrauma}</Text>
                </View>
                <View className='right flex'>
                  {!trauma && <View className='red-dot'></View>}
                  {trauma && trauma === '否' ? trauma : null}
                  <Image
                    className='next'
                    src={`${ossHost}images/next.png`}
                  ></Image>
                </View>
              </View>
            </View>
            {trauma && trauma !== '否'
              ? (
              <View
                className={`tag-list flex ${
                  trauma.split(',').length === 1 ? 'one' : ''
                }`}
              >
                {trauma.split(',').map(item => {
                  return (
                    <View className='tag-item flex' key={item}>
                      <View className='item-content'>{item}</View>
                    </View>
                  );
                })}
              </View>
                )
              : null}
          </View>
          <View
            className='list'
            onClick={() => {
              this.setShowNumber(14);
            }}
          >
            <View className='common-item flex no-border'>
              <View className='common-item-content flex'>
                <View className='left flex'>
                  <Text>{i18n.chain.user.historyPresentillness}</Text>
                </View>
                <View className='right flex'>
                  {!existingDiseases && <View className='red-dot'></View>}
                  {existingDiseases && existingDiseases === '否'
                    ? existingDiseases
                    : null}
                  <Image
                    className='next'
                    src={`${ossHost}images/next.png`}
                  ></Image>
                </View>
              </View>
            </View>
            {existingDiseases && existingDiseases !== '否'
              ? (
              <View
                className={`tag-list flex ${
                  existingDiseases.split(',').length === 1 ? 'one' : ''
                }`}
              >
                {existingDiseases.split(',').map(item => {
                  return (
                    <View className='tag-item flex' key={item}>
                      <View className='item-content'>{item}</View>
                    </View>
                  );
                })}
              </View>
                )
              : null}
          </View>
          <View
            className='list'
            onClick={() => {
              this.setShowNumber(15);
            }}
          >
            <View className='common-item'>
              <View className='common-item-content flex no-border'>
                <View className='left flex'>
                  <Text>{i18n.chain.user.liverFunction}</Text>
                </View>
                <View className='right flex'>
                  {liverFunction
                    ? (
                    <Text>{liverFunction}</Text>
                      )
                    : (
                    <View className='red-dot'></View>
                      )}
                  <Image
                    className='next'
                    src={`${ossHost}images/next.png`}
                  ></Image>
                </View>
              </View>
            </View>
          </View>
          <View
            className='list'
            onClick={() => {
              this.setShowNumber(16);
            }}
          >
            <View className='common-item'>
              <View className='common-item-content flex '>
                <View className='left flex'>
                  <Text>{i18n.chain.user.renalFunction}</Text>
                </View>
                <View className='right flex'>
                  {renalFunction
                    ? (
                    <Text>{renalFunction}</Text>
                      )
                    : (
                    <View className='red-dot'></View>
                      )}
                  <Image
                    className='next'
                    src={`${ossHost}images/next.png`}
                  ></Image>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className='health-info-content mt-16'>
          <View className='content-title flex'>报告单</View>
          <View
            className='common-item'
            onClick={() => {
              this.uploadReport('prescriptions');
            }}
          >
            <View className='common-item-content flex no-border'>
              <View className='left flex'>
                <Text>处方单</Text>
              </View>
              <View className='right flex'>
                {prescriptionNumber
                  ? (
                  <Text>{prescriptionNumber}张</Text>
                    )
                  : (
                  <View className='red-dot'></View>
                    )}
                <Image
                  className='next'
                  src={`${ossHost}images/next.png`}
                ></Image>
              </View>
            </View>
          </View>
          <View
            className='common-item'
            onClick={() => {
              this.uploadReport('assay');
            }}
          >
            <View className='common-item-content flex '>
              <View className='left flex'>
                <Text>化验单</Text>
              </View>
              <View className='right flex'>
                {assayNumber
                  ? (
                  <Text>{assayNumber}张</Text>
                    )
                  : (
                  <View className='red-dot'></View>
                    )}
                <Image
                  className='next'
                  src={`${ossHost}images/next.png`}
                ></Image>
              </View>
            </View>
          </View>
          <View
            className='common-item'
            onClick={() => {
              this.uploadReport('material');
            }}
          >
            <View className='common-item-content flex '>
              <View className='left flex'>
                <Text>影像材料</Text>
              </View>
              <View className='right flex'>
                {materialNumber
                  ? (
                  <Text>{materialNumber}张</Text>
                    )
                  : (
                  <View className='red-dot'></View>
                    )}
                <Image
                  className='next'
                  src={`${ossHost}images/next.png`}
                ></Image>
              </View>
            </View>
          </View>
        </View>
        {showNumber === 9
          ? (
          <Disease
            title={i18n.chain.user.diseaseHistory}
            subTitle={i18n.chain.setHeathly.isDiseaseHistory}
            showNumber={showNumber}
            selectText={disease}
            close={() => {
              this.setShowNumber(0);
            }}
            confirm={obj => {
              this.saveData(obj);
            }}
          ></Disease>
            )
          : null}
        {showNumber === 11
          ? (
          <Disease
            title={i18n.chain.user.familyHistory}
            subTitle={i18n.chain.setHeathly.isFamilyHistory}
            showNumber={showNumber}
            selectText={familialDiseases}
            close={() => {
              this.setShowNumber(0);
            }}
            confirm={obj => {
              this.saveData(obj);
            }}
          ></Disease>
            )
          : null}
        {showNumber === 10
          ? (
          <InputHistory
            title={i18n.chain.user.allergicHistory}
            subTitle={i18n.chain.setHeathly.isAllergies}
            showNumber={showNumber}
            selectText={allergyHistory === '否' ? '' : allergyHistory}
            selectDrugText={drugAllergy === '否' ? '' : drugAllergy}
            close={() => {
              this.setShowNumber(0);
            }}
            confirm={(text, drugText) => {
              this.saveData({
                allergyHistory: text,
                drugAllergy: drugText
              });
            }}
            drug={false}
          ></InputHistory>
            )
          : null}

        {showNumber === 12
          ? (
          <Disease
            title={i18n.chain.user.surgicalHistory}
            subTitle={i18n.chain.setHeathly.isSurgical}
            showNumber={showNumber}
            selectText={operation === '否' ? '' : operation}
            close={() => {
              this.setShowNumber(0);
            }}
            confirm={obj => {
              this.saveData(obj);
            }}
          ></Disease>
            )
          : null}
        {showNumber === 13
          ? (
          <InputHistory
            title={i18n.chain.user.historyTrauma}
            showNumber={showNumber}
            subTitle={i18n.chain.setHeathly.isTrauma}
            selectText={trauma === '否' ? '' : trauma}
            close={() => {
              this.setShowNumber(0);
            }}
            confirm={text => {
              this.saveData({ trauma: text });
            }}
            selectDrugText=''
            drug={false}
          ></InputHistory>
            )
          : null}
        {showNumber === 14
          ? (
          <Disease
            title={i18n.chain.user.historyPresentillness}
            subTitle={i18n.chain.setHeathly.isCurrentHistory}
            showNumber={showNumber}
            selectText={existingDiseases === '否' ? '' : existingDiseases}
            close={() => {
              this.setShowNumber(0);
            }}
            confirm={obj => {
              this.saveData(obj);
            }}
          ></Disease>
            )
          : null}
        {showNumber === 15 || showNumber === 16
          ? (
          <YesAndNo
            healthyFile={healthyFile}
            showNumber={showNumber}
            setShowNumber={() => {
              this.setShowNumber(0);
            }}
            saveData={data => {
              this.saveData(data);
            }}
          ></YesAndNo>
            )
          : null}
      </View>
    );
  }
}
export default HealthInfo;

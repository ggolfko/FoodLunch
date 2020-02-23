import React, {Component, useRef} from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  Modal,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  ImageBackground,
  StatusBar,
  SafeAreaView,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {connect} from 'react-redux';
import {
  setScreenBadge,
  setScreenBadgeNow,
  setDarkMode,
  setLanguage,
  setPositionNow,
} from '../actions';
import AsyncStorage from '@react-native-community/async-storage';
import {Appbar, Text, Searchbar} from 'react-native-paper';
import ActionButton from 'react-native-action-button';
import I18n from '../../helpers/i18n';
import * as Api from '../actions/api';
import * as GFun from '../../helpers/globalFunction';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {styles} from '../../helpers/styles';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const IS_IOS = Platform.OS === 'ios';

class OrderTrackingMapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      isDarkMode: props.setting.isDarkMode,
      region: {},
      order: null,
      spinner: false,
    };
  }

  async componentDidMount() {
    await this.props.setPositionNow();
    this.setState({
      region: {
        latitude: this.props.localtion.latitude,
        longitude: this.props.localtion.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    });
  }

  onRegionChange(region) {
    this.setState({region: region});
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingTop: 20,
        }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          annotations={this.state.markers}
          style={{
            flex: 1,
            height: height,
            width: width,
          }}
          region={this.state.region}>
          <MapView.Marker
            coordinate={{
              latitude: this.props.localtion.latitude,
              longitude: this.props.localtion.longitude,
            }}
            title={this.props.localtion.district}
            description={this.props.localtion.formattedAddress}
          />
        </MapView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  screenBadge: state.screenBadge,
  setting: state.setting,
  localtion: state.localtion,
});

const mapDispatchToProps = {
  setScreenBadge,
  setScreenBadgeNow,
  setDarkMode,
  setLanguage,
  setPositionNow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderTrackingMapView);
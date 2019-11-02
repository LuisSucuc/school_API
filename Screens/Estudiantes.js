import React, { Component } from "react";
import { ActivityIndicator, StyleSheet } from 'react-native'
import { Container, Header, Content, Form, Item, Title, Right, FooterTab, Text,
          Picker, Icon, Left, Footer, Button, Body,   List, ListItem, H1, H2, H3, Thumbnail, Subtitle
         } from 'native-base';
import * as Font from 'expo-font'
import { showMessage, hideMessage } from "react-native-flash-message";



//base de datos remota
var gThis = null;

export default class LoginScreen extends Component {

  constructor(props) {
    super(props);
    navigation_var = this.props;
    gThis = this;
   
    this.state = {
      loading: true,
      estudiantes : [],
      estudiante : "",
      pagos: [],
    };
   

    /*

    db.allDocs({include_docs: true, descending: true}, function(err, doc) {
      console.log(doc.rows);
    });
    */
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("../node_modules/native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("../node_modules/native-base/Fonts/Roboto_medium.ttf"),
      
    });
    this.setState({loading:false})
    
  }

  componentDidMount() {
    this.getEstudiantes()
  }



  getEstudiantes() {
    
    fetch('https://luissucuc.pythonanywhere.com/jempresarial/services/estudiantes')
    
      .then((response) => response.json())
      .then((responseJson) => {

    
        this.setState({ estudiantes : responseJson })
        console.log(responseJson)
        return responseJson;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getPagos(estudianteId) {
    if (estudianteId) {
      this.setState({ estudiante : estudianteId})
      this.setState({ loading: !this.state.loading})
      fetch('https://luissucuc.pythonanywhere.com/jempresarial/services/pagos', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estudianteId: estudianteId
        }),
      }) 
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ pagos : responseJson })
        console.log(responseJson)
        this.setState({ loading: !this.state.loading})
        
      })
      .catch((error) => {
        this.setState({ loading: !this.state.loading})
        console.log(error);
      });
    }
  }

  
  render() {
    
    let { estudiantes, pagos} = this.state

    if (this.state.loading) {
      return  <ActivityIndicator />;
    }
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={()=>{ this.props.navigation.navigate("LoginScreen"); }}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Grupo 02 - Desarrollo Web</Title>
            <Subtitle>Pagos</Subtitle>
          </Body>
          <Right />
        </Header>
        <Content>

        
        
        
          <Form>
            <Item picker>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                style={{ width: undefined }}
                placeholder="Select your SIM"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.estudiante}
                onValueChange={ (estudianteId) => { this.getPagos(estudianteId) } }>
                  <Picker.Item  label={'Selecciona estudiante'} value={''} />
                  {estudiantes.map((element, index) => {
                  return (   
                          <Picker.Item label={`${element.nombres} ${element.apellidos}`} value={element.id} key={element.id} />
                            )
                  })}
              </Picker>
            </Item>
          </Form>
          
            <Button info rounded onPress={()=>{this.getPagos(this.state.estudiante)}}>
              <Text>Actualizar</Text>
            </Button>

          <List>


          {pagos.map((element, index) => {
                  return (   
                    <ListItem key={element.id}>
                      <Body>
                        
                        <H3 style={[ element.pagado ? styles.green : styles.red  ] }> { element.pagado ? <Icon type="FontAwesome" name="check"  style={[styles.green, styles.iconSize]} /> : <Text></Text> }  { element.nombre}</H3>
                        <Text style={[ element.pagado ? styles.green : styles.red  ] } note>{ element.pagado ? 'Cancelado' : 'PENDIENTE'}</Text>
                      </Body>
                  </ListItem>
                  )
              })}
           
          </List>


          </Content>
      </Container>
    );
  }
}



const styles = StyleSheet.create({
  iconSize: {
    fontSize: 15,
  },
  green: {
    color: 'green',
  },
  red: {
    color: 'red',
  },
});

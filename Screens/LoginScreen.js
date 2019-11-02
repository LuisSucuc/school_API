import React, { Component } from "react";
import { ActivityIndicator, Image } from 'react-native'
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
      grados : [],
      grado : "",
      estudiantes: [],
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
    this.getMoviesFromApiAsync()
  }



  getMoviesFromApiAsync() {
    
    fetch('https://luissucuc.pythonanywhere.com/jempresarial/services/secciones_grados')
    
      .then((response) => response.json())
      .then((responseJson) => {

    
        this.setState({ grados : responseJson })
        console.log(responseJson)
        return responseJson;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getEstudiantes(gradoId) {
    if (gradoId) {
      this.setState({ grado : gradoId})
      this.setState({ loading: !this.state.loading})
      fetch('https://luissucuc.pythonanywhere.com/jempresarial/services/estudiantes_grado', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gradoId: gradoId
        }),
      }) 
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ estudiantes : responseJson })
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
    
    let { grados, estudiantes} = this.state

    if (this.state.loading) {
      return  <ActivityIndicator />;
    }
    return (
      <Container>
        <Header>
          <Body>
            <Title>Grupo 02</Title>
            <Subtitle>Grados</Subtitle>

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
                selectedValue={this.state.grado}
                onValueChange={ (gradoId) => { this.getEstudiantes(gradoId) } }>
                  <Picker.Item  label={'Selecciona grado'} value={''} />
                  {grados.map((element, index) => {
                  return (   
                          <Picker.Item label={element.grado} value={element.id} key={element.grado} />
                            )
                  })}
              </Picker>
            </Item>
          </Form>
          
            <Button info rounded onPress={()=>{this.getEstudiantes(this.state.grado)}}>
              <Text>Actualizar</Text>
            </Button>

          <List>


          {estudiantes.map((element, index) => {
                  return (   
                    <ListItem avatar key={element.nombres}>
                       <Left>
                        <Thumbnail source={{ uri: element.picture }} />
                      </Left>
                      <Body>
                        <H3>{`${element.nombres} ${element.apellidos}`}</H3>
                        <Text note>{element.email}</Text>
                        <Text note>Fecha de ingreso: {element.fecha_ingreso}</Text>
                        <Text note>Fecha de nacimiento: {element.fecha_nacimiento}</Text>
                        <Text note>Sexo: {element.sexo}</Text>

                      </Body>
                  </ListItem>
                  )
              })}
           
          </List>


          </Content>
        <Footer>
          <FooterTab>
            <Button full onPress={()=>{ this.props.navigation.navigate("Estudiantes"); }}>
              <Text>Estudiantes</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

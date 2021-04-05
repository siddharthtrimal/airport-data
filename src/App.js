import React from 'react';
import './App.css';
import data from  './airports.json'
import leftArrow from './utils/arrow_left.png';
import rightArrow from './utils/arrow_right.png';
import { types,  convertDd } from './utils/utils'
import styled from 'styled-components'

const LOCALCOUNT = 4;

const PageTitle = styled.h1`
  text-align: start;
  padding-left: 1.5rem;
`;

const PageTitleSpan = styled.span`
  color : #ddd;
`

const FilterDiv =  styled.div`
  display : flex;
  flex-wrap : wrap;
`

const TypeFilter = styled.div`
 display : block;
`;

const TypeTitle = styled.h2`
  line-height : 0px;
  padding-left : 25px;
  text-align : left;
`;

const TypeOptions = styled.div`
  padding : 20px;
  min-width: 60%;
  display : flex;
  flex-wrap : wrap;
  align-items : center;
  justify-content : space-between;
`;

const SearchFilterDiv = styled.div`
  display : block;
  text-align : left;
`;

const SearchInput = styled.input`
  width : 200px;
  outline : 0;
  border : 0px;
  border-bottom : 2px solid black;
  margin : 20px;
`;


const TableContainer = styled.div`
  display : flex;
  justify-content : center;
  padding : 25px;
`;

const TableNav = styled.div`
  display : flex;
  justify-content : space-between;
  align-items: center;
  padding : 20px 25px;
`;

const NavButton = styled.button`
  background : none;
  border : none;
  outline : none;
`;

const ArrowImg = styled.img`
  height : 40px;  
  width : 40px;
`;

const BoldSpan = styled.span`
 font-weight : bold
`;
class App extends React.Component {

  state={
    type : [],
    typeFilteredData : null,
    result : [],
    count : 0,
    searchTerm : ""
  }

  componentDidMount(){
    const typeSortedData =  this.getTypeSortedData(data);
    const localData = JSON.parse(localStorage.getItem('filterData'))
    if(!!localData) {
      this.setState({
        type : localData.type || [],
        count : localData.count || 0,
        searchTerm : localData.searchTerm || "",
        typeFilteredData : typeSortedData
      }, ()=> this.setFilteredData())
    }
    this.setState({typeFilteredData : typeSortedData, result : data})
  }

  componentDidUpdate(){
    const filterData = {
      type : this.state.type,
      count : this.state.count,
      searchTerm : this.state.searchTerm

    }
    localStorage.setItem('filterData', JSON.stringify(filterData))
  }

  getTypeSortedData =(value)=>{

    let typeSortedData = {};
    for(let i = 0; i< value.length ; i++){
      if(!typeSortedData[`${value[i].type}`]) {
        typeSortedData[`${value[i].type}`] = []
      }
      typeSortedData[`${value[i].type}`].push(value[i]);
    }
    return typeSortedData;
  }

  handleChange = (data) =>{
    let temp = [...this.state.type];
    const dataIndex = temp.indexOf(data);
    if(dataIndex > -1){
      temp.splice(dataIndex, 1);
    }else{
      temp.push(data)
    } 
    this.setState({...this.state,count : 0, type : temp}, ()=>{
      this.setFilteredData();
    });
  }

  setFilteredData = () =>{
    let resultArray = [];
    for(let i = 0; i < this.state.type.length ; i++){
      if(!!this.state.typeFilteredData[`${this.state.type[i]}`]) {
        resultArray = [...resultArray, ...this.state.typeFilteredData[`${this.state.type[i]}`]];
      } 
    }
    if(resultArray.length === 0 ){
      if(this.state.type.length === 0) this.setState({result : data}, ()=> !!this.state.searchTerm.trim() && this.searchData())
      else this.setState({result : []})
    }else this.setState({result : resultArray}, ()=> !!this.state.searchTerm.trim() && this.searchData());
    
  }

  handleSearchInput =(e)=>{
    this.setFilteredData();
    this.setState({searchTerm : e.target.value})
  }

  searchData =()=>{
      if(!this.state.searchTerm.trim()) return this.setFilteredData();
      let tempData = [];
      tempData =  this.state.result.filter( a => Object.keys(a).some(k => !!a[k] && a[k].toString().toLowerCase().indexOf(this.state.searchTerm.trim().toLowerCase())> -1));
      this.setState({result : tempData, count : 0})
  }

  render(){
    return (
      <div className="App">
        <PageTitle>Filter <PageTitleSpan>airports</PageTitleSpan></PageTitle> 
        <FilterDiv>
          <TypeFilter>
            <TypeTitle>Type</TypeTitle>
            <TypeOptions>
              {
                types.map(ele=>{
                  return(
                    <span key={ele.title}>
                      <label style={{padding : '5px'}}>
                        <input
                          type="checkbox"
                          checked={this.state.type.indexOf(ele.value) > -1}
                          onChange={()=>this.handleChange(ele.value)}
                        />
                        {ele.title}
                      </label>
                    </span>
                  )
                })
              }
            </TypeOptions> 
          </TypeFilter>
          <div>
            <SearchFilterDiv>
              <TypeTitle>Filter by search</TypeTitle>
              <SearchInput 
                value={this.state.searchTerm}
                onChange={(e)=> this.handleSearchInput(e)}
                placeholder={"Search"}/>
            </SearchFilterDiv>
          </div>
        </FilterDiv> 
        { this.state.result.length > 0 ? ( 
          <>
            <TableContainer>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>ICAO</th>
                    <th>IATA</th>
                    <th>Elev.</th>
                    <th>Lat.</th>
                    <th>Long.</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.result.slice(this.state.count,(this.state.count+ LOCALCOUNT)).map(ele=>{
                      const temp = convertDd(ele.latitude, ele.longitude).split(" ");
                      return(
                        <tr key={ele.name + ele.icao}>
                          <td data-label="Name">{ele.name}</td>
                          <td data-label="ICAO">{ele.icao}</td>
                          <td data-label="IATA">{ele.iata}</td>
                          <td data-label="Elev.">{ele.elevation}</td>
                          <td data-label="Lat.">{temp[0]}</td>
                          <td data-label="Long.">{temp[1]}</td>
                          <td data-label="Type">{ele.type}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </TableContainer>
            <TableNav>
              <NavButton 
                disabled={this.state.count === 0 }
                onClick={()=>this.setState({count : (this.state.count- LOCALCOUNT)})}>
                  <ArrowImg alt="left" src={leftArrow}/>
              </NavButton>
              <div>Showing <BoldSpan>{(this.state.count+1)+"-"+((this.state.count+ LOCALCOUNT) >= this.state.result.length  ? this.state.result.length : (this.state.count+ LOCALCOUNT))}</BoldSpan> of <BoldSpan>{this.state.result.length}</BoldSpan> results</div>
              <NavButton
                disabled={(this.state.count+ LOCALCOUNT) >= this.state.result.length}
                onClick={()=>this.setState({count : (this.state.count + LOCALCOUNT)})}>
                  <ArrowImg alt="right"  src={rightArrow}/>
              </NavButton>
            </TableNav>
          </>) : <p>No Results Found</p>}
      </div>
    );
  }
}

export default App;

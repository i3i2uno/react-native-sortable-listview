import ReactDom, { findDOMNode } from 'react-dom'
import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native'
import Styles from 'config/style'
import Icon from 'react-native-vector-icons/FontAwesome'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

const SortableItem = SortableElement((props) => {
	return props.render(Object.assign({}, props.data))
});

const SortableList = SortableContainer((props) => {
  return (
    <div>
      {props.items.map((value, index) => {
      	if(props.rowHasChanged){
      		props.rowHasChanged(props.data[value], props.data[value]);
      	}

        return <SortableItem key={`item-${value}`} index={index} data={props.data[value]} render={props.render} />
      })}
    </div>
  );
});

class SortableListView extends Component {
	constructor(props){
		super(props);

		this.state = {
			refreshing: false
		}
	}
	actions() {
		let self = this;
		return {
			_onRefresh(runMethod){
				self.setState({ refreshing: true });
				if(self.props.onRefresh && (runMethod === undefined || runMethod)){
					self.props.onRefresh(function(){
						self.setState({ refreshing: false });
					})
				} else {
					self.setState({ refreshing: false });
				}
			},
			onSortEnd(indexes, e){
				let props = self.props;
				if(props.onRowMoved){
					props.onRowMoved({ to: indexes.newIndex, from: indexes.oldIndex })
				}
			}
		}
	}
	componentDidMount(){
		let cont = findDOMNode(this.refs.scrollContainer);
		cont.scrollTop = 50;
	}
	render() {
		var self = this,
			props = self.props,
			state = self.state,
			data = props.data,
			rows = props.order,
			actions = self.actions();

		return (
			<View ref={"scrollContainer"} style={StyleSheet.flatten([props.style || {}, { flexDirection: 'column', flex: 1, overflowX: 'hidden' }])}>
				{props.onRefresh && <View style={{ height: 50, flexDirection: 'column', alignItems: 'center' }}>
						<TouchableHighlight underlayColor={'white'} style={{ marginTop: 10, padding: 5 }} onPress={actions._onRefresh}>
							<Icon name={state.refreshing ? "refresh fa-spin" : "refresh"} size={20} color={props.tintColor || 'white'} />
						</TouchableHighlight>
					</View>}

				<SortableList items={rows} onSortEnd={actions.onSortEnd} lockAxis={"y"} pressDelay={300} data={props.data} rowHasChanged={props.rowHasChanged} render={props.renderRow} />

			</View>
		)
	}
}

module.exports = SortableListView;
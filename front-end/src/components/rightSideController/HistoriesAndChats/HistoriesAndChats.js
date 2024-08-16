import { useEffect, useState, memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';

import './HistoriesAndChats.css';
import VerifyDialog from '../VerifyDialog/VerifyDialog';

var histories = [];
var historiesLength = 0;
var messages = [];
var messagesLength = 0;
var orderTurn = 1;

function HistoriesAndChats({ handleFinishGame }) {
  const [verifyDraw, setVerifyDraw] = useState(false);
  const [verifyAbort, setVerifyAbort] = useState(false);
  const roomInfor = useSelector((state) => state.game.roomInfor);

  // show histories
  const showHistories = useCallback((histories) => {
    // get div tag histories
    const historiesSection = document.getElementById('historiesSection');
    if (historiesSection) {
      let childNodes = historiesSection.childNodes;
      // when user reconnect, we will render all histories instead of each one
      if (childNodes.length === 0) {
        histories.forEach((item, index) => {
          let position = item[0]['to'];
          showMove(index, position, historiesSection);
          removeActiveClass(historiesSection);
        });
      } else {
        const lastIndex = histories.length - 1;
        // get value of the last move piece
        const position = histories[lastIndex][0].san;
        // remove class "active"
        if (lastIndex > 0) {
          removeActiveClass(historiesSection);
        }
        showMove(lastIndex, position, historiesSection);
      }
    }
  }, []);

  useEffect(() => {
    if (roomInfor) {
      // console.log(roomInfor);
      histories = roomInfor.histories;
      if (histories.length > historiesLength) {
        showHistories(histories);
        historiesLength = histories.length;
      }

      messages = roomInfor.messages;
      if (messages.length > messagesLength) {
        showMessages(messages);
        messagesLength = messages.length;
      }
    }
  }, [roomInfor, showHistories]);

  const showMove = (index, position, parent) => {
    // if the moveing piece belong to the white player
    if (index % 2 === 0) {
      const historiesGroupSection = document.createElement('div');
      historiesGroupSection.className = 'histories_group';
      historiesGroupSection.id = orderTurn.toString();
      historiesGroupSection.innerHTML = `
        <span class="histories_group-turn">${orderTurn}.</span>
        <span class="histories_group-white-turn san active">${position}</span>
      `;
      parent.appendChild(historiesGroupSection);
    } else {
      const historiesGroupSection = document.getElementById(`${orderTurn}`);

      if (historiesGroupSection) {
        const blackTurnElement = document.createElement('span');
        blackTurnElement.className = 'histories_group-black-turn san active';
        blackTurnElement.innerHTML = position;

        historiesGroupSection.appendChild(blackTurnElement);
        orderTurn++;
      }
    }
  };

  const removeActiveClass = (parent) => {
    const activeClassElements = parent.querySelectorAll(
      '.histories_group .active'
    );
    activeClassElements.forEach((element) => {
      element.classList.remove('active');
    });
  };

  // show messages
  const showMessages = (messages) => {
    // get div tag chat_box-messages
    var chatBox = document.getElementById('chatboxSection');
    if (chatBox) {
      const lastElement = messages[messages.length - 1];
      const element = document.createElement('p');
      element.innerHTML = lastElement;
      chatBox.appendChild(element);
    }
  };

  // show / hide dialog verify
  function handleVerify(options) {
    if (options === 'draw') {
      setVerifyDraw(true);
      setVerifyAbort(false);
    } else {
      setVerifyDraw(false);
      setVerifyAbort(true);
    }
  }
  // handel draw / abort / resign
  function handleChooseOptions(options) {
    // console.log('option: ', options);
    setVerifyDraw(false);
    setVerifyAbort(false);
    if (options !== 'no') {
      handleFinishGame(options);
    }
  }

  return (
    <div className="hac_container">
      {/* show all piece moves */}
      <div className="histories" id="historiesSection"></div>

      {/* when the player wants to draw or resign, abort */}
      <div className="finish_game">
        <span className="finish_game-draw" onClick={() => handleVerify('draw')}>
          1/2 Draw
          {verifyDraw && (
            <VerifyDialog
              message="Do you want to offer a draw?"
              handleChooseOptions={handleChooseOptions}
              optionAccept="offer draw"
            />
          )}
        </span>
        <span
          className="finish_game-abort"
          onClick={() => handleVerify('abort')}
        >
          <FontAwesomeIcon icon={faFlag} />{' '}
          {histories?.length >= 4 ? 'resign' : 'abort'}
          {verifyAbort && (
            <VerifyDialog
              message={`Are you sure want to ${
                histories?.length >= 4 ? 'resign' : 'abort'
              }?`}
              handleChooseOptions={handleChooseOptions}
              optionAccept={`offer ${
                histories?.length >= 4 ? 'resign' : 'abort'
              }`}
            />
          )}
        </span>
      </div>

      {/* show all messages */}
      <div className="chat_box-messages" id="chatboxSection">
        {/* <p>ttson01 offer the draw game</p>
        <p>ttson01 offer the draw game</p>
        <p>ttson01 offer the draw game</p> */}
      </div>

      {/* the place for player can enter and send the message */}
      <input
        className="chat_box-enter_message"
        placeholder="Send a message..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleFinishGame('send message', e.target.value);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}

export default memo(HistoriesAndChats);

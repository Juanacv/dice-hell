(function() {
	var $roll = document.getElementById('roll');
	function _disableButton() {
		//no me gusta usar variables globales en una funcion, pero...
		$roll.disabled = true;
		$roll.classList.remove("btn-primary");
		$roll.classList.add("btn-secondary");
		//fin				
	}
	function _enableButton() {
		//otra vez modificando variables globales, para un futuro tal vez convertir el código en una clase
		$roll.classList.remove("btn-secondary");
		$roll.classList.add("btn-primary");	
		$roll.disabled = false;
		//fin				
	}
	function _showResultGrouped($groupArray, $invalidDicesArr) {
		//muestra el resultado agrupado por valores
		$groupContainter = document.getElementById('group'),
		$textGroup = '';
		$groupContainter.innerHTML = '';
		for (var index in $groupArray) {
			$class = "text-success";
			if ($invalidDicesArr.includes(parseInt(index))) {
				$class = "text-danger";
			}
			$textGroup += '<span class="'+$class+'">'+ $groupArray[index]+':['+index+']'+'</span>'+'-';
		}
		$groupContainter.innerHTML = '{'+$textGroup.substring(0,$textGroup.length-1)+'}';	
		//fin					
	}
	function _applyModification($totalInt) {
		$totalModification = parseInt(document.getElementById('totalModification').value);
		if (isNaN($totalModification)) $totalModification = 0;
		return $totalInt + $totalModification;
	}
	function _paintHTML($throwContainer, $singleThrow) {
		$throwContainer.innerHTML = $throwContainer.innerHTML + '<div class="col-md-2"><div class="card"><h4>'+$singleThrow+'</h4></div></div>';	
	}
	function _groupingArray($groupArray,$singleThrow) {
		//agrupa los resultados en un array
		if (typeof $groupArray[$singleThrow] === 'undefined') {
			$groupArray[$singleThrow] = 1;
		}
		else {
			$groupArray[$singleThrow] = $groupArray[$singleThrow] + 1;
		}	
		return $groupArray;					
	}
	function showThrow($throw, $invalidDicesArr) {
		var $throwContainer = document.getElementById('throwContainer'),
		$total = document.getElementById('total'),
		$groupArray = [],
		$totalInt = 0;
		
		$throwContainer.innerHTML = '';
		$total.value = 0;
		
		_disableButton();
		
		for (var i = 0; i < $throw.length; i++) {
			_paintHTML($throwContainer, $throw[i]);
			if (!$invalidDicesArr.includes($throw[i])) {
				$totalInt += $throw[i];	
			}						
			$groupArray = _groupingArray($groupArray,$throw[i]);
		}
		
		$total.value = _applyModification($totalInt);
		_enableButton();
		_showResultGrouped($groupArray, $invalidDicesArr);
	}
	function _splitAndParse($invalidDices, $diceType) {
		var $invalidDicesArr = $invalidDices.split(","),
		$filteredDices = [];
		for (var i = 0; i < $invalidDicesArr.length; i++) {
			$invalidDice = parseInt($invalidDicesArr[i]);
			if (!isNaN($invalidDice) && $invalidDice >= 1 && $invalidDice <= $diceType) {
				$filteredDices.push($invalidDice);
			}
		}
		return $filteredDices;
	}
	function rollDices() {
		var $diceSelect = document.getElementById('diceType'),
		$diceInput = document.getElementById('diceNumber'),
		$invalidDices = document.getElementById('invalidDices').value,
		$invalidDicesArr = [],
		$throw = [];
		
		var $diceType = parseInt($diceSelect.options[$diceSelect.selectedIndex].value,10);
		
		var $diceNumber = parseInt($diceInput.value,10);

		
		if (!isNaN($diceNumber) && !isNaN($diceType) && $diceNumber <= 256) {	
			$invalidDicesArr = _splitAndParse($invalidDices, $diceType);
			for (var i = 0; i < $diceNumber; i++) {
				$throw.push(Math.floor(Math.random() * $diceType) + 1);
			}
		}
		else {
			alert("Inserte un número de dados igual o inferior a 256");
		}
		showThrow($throw, $invalidDicesArr);
	}
	
	$roll.addEventListener('click', rollDices);
	
})();
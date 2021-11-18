#!/bin/bash
declare -i port=3000

names=(
    "abderahimmalick.assimmahamat"
    "florian.aubin"
    "bastien.aubry"
    "romain.axilais"
    "nicolas.baca"
    "valentin.baudry"
    "robin.bigeard"
    "simon.billet"
    "clemence.bitaud"
    "axel.borget"
    "alexis.brohan"
    "killian.cambert"
    "geoffrey.clermont"
    "alexis.coinet"
    "martin.danvers"
    "marceau.david"
    "mael.debon"
    "jeremie.delecrin"
    "medi.demirdelen"
    "quentin.duchesne"
    "mael.fournier"
    "joris.gallot"
    "simon.galoyan"
    "alexandre.garault"
    "marius.gaudin"
    "marie.gautron"
    "arthur.geay"
    "guillaume.gouy"
    "valentin.guibert"
    "antonin.joulie"
    "abdellah.jrondi"
    "auriane.labille"
    "maxime.preard"
    "yessi.yessiymunguengui"
    "abdellatif.elmaknati"
)

for name in "${names[@]}"; do
    port=$port+1
    export "NAME=$name"
    export "PORT=$port"
    echo $NAME
    echo $PORT
    node david.js &
done
exit 0

<?php

namespace backend\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use backend\models\EncodeProfile;

/**
 * EncodeProfileSearch represents the model behind the search form about `\backend\models\EncodeProfile`.
 */
class EncodeProfileSearch extends EncodeProfile
{
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'type'], 'integer'],
            [['name', 'audiocodec', 'samplerate', 'audiobitrate', 'videocodec', 'framerate', 'size', 'videobitrate', 'is_active', 'created_at', 'updated_at', 'extension', 'format'], 'safe'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    /**
     * Creates data provider instance with search query applied
     *
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params)
    {
        $query = EncodeProfile::find();

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'sort' => ['defaultOrder' => ['id' => SORT_DESC]]
        ]);

        $this->load($params);

        if (!$this->validate()) {
            // uncomment the following line if you do not want to any records when validation fails
            // $query->where('0=1');
            return $dataProvider;
        }

        $query->andFilterWhere([
            'id' => $this->id,
            'type' => $this->type,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ]);

        $query->andFilterWhere(['like', 'name', $this->name])
            ->andFilterWhere(['like', 'audiocodec', $this->audiocodec])
            ->andFilterWhere(['like', 'samplerate', $this->samplerate])
            ->andFilterWhere(['like', 'audiobitrate', $this->audiobitrate])
            ->andFilterWhere(['like', 'videocodec', $this->videocodec])
            ->andFilterWhere(['like', 'framerate', $this->framerate])
            ->andFilterWhere(['like', 'size', $this->size])
            ->andFilterWhere(['like', 'videobitrate', $this->videobitrate])
            ->andFilterWhere(['like', 'is_active', $this->is_active])
            ->andFilterWhere(['like', 'extension', $this->extension])
            ->andFilterWhere(['like', 'format', $this->format]);

        return $dataProvider;
    }
}
